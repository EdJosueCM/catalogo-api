// Prueba de consistencia bajo concurrencia:
// varios usuarios agregan el mismo producto a favoritos mientras el administrador lo elimina.
// Al terminar no debe quedar ningún favorito que apunte a un producto inexistente.
//
//   Requisitos: servidor iniciado (npm start), npm run seed y npm run crear-admin ya ejecutados.
//   Uso: npm run test:concurrencia
const config = require('../src/config/env');
const { conectarDB, desconectarDB } = require('../src/config/db');
const Favorito = require('../src/models/Favorito');
const Usuario = require('../src/models/Usuario');

const BASE = process.env.BASE_URL || `http://localhost:${config.port}`;
const USUARIOS = 20;
const INTENTOS = 10;

async function peticion(metodo, ruta, { cuerpo, token } = {}) {
  const res = await fetch(`${BASE}/api${ruta}`, {
    method: metodo,
    headers: {
      ...(cuerpo && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: cuerpo && JSON.stringify(cuerpo),
  });
  return { status: res.status, json: await res.json() };
}

// Ids de los favoritos de los usuarios de esta prueba cuyo producto ya no existe.
async function buscarHuerfanos(idsUsuarios) {
  const filas = await Favorito.aggregate([
    { $match: { usuario: { $in: idsUsuarios } } },
    { $lookup: { from: 'productos', localField: 'producto', foreignField: '_id', as: 'p' } },
    { $match: { p: { $size: 0 } } },
    { $project: { _id: 1 } },
  ]);
  return filas.map((f) => f._id.toString());
}

async function main() {
  await conectarDB();
  const etiqueta = Date.now().toString(36);
  const patronCorreos = new RegExp(`^concurrencia\\.${etiqueta}\\.`);

  const login = await peticion('POST', '/auth/login', {
    cuerpo: { correo: process.env.ADMIN_CORREO, password: process.env.ADMIN_PASSWORD },
  });
  if (login.status !== 200) throw new Error('No se pudo iniciar sesión como administrador (revisa .env).');
  const tokenAdmin = login.json.data.token;

  const tokens = [];
  for (let i = 0; i < USUARIOS; i++) {
    const correo = `concurrencia.${etiqueta}.${i}@ejemplo.test`;
    await peticion('POST', '/auth/registro', { cuerpo: { nombre: `Concurrencia ${i}`, correo, password: 'ClavePrueba123' } });
    const r = await peticion('POST', '/auth/login', { cuerpo: { correo, password: 'ClavePrueba123' } });
    tokens.push(r.json.data.token);
  }

  const idsUsuarios = (await Usuario.find({ correo: patronCorreos }, '_id')).map((u) => u._id);
  // Se guardan ids distintos para no contar dos veces el mismo favorito.
  const huerfanosEnBD = new Set();
  const respuestasConProductoNulo = new Set();

  for (let intento = 0; intento < INTENTOS; intento++) {
    const creado = await peticion('POST', '/productos', {
      token: tokenAdmin,
      cuerpo: { nombre: `Concurrencia ${etiqueta} ${intento}`, descripcion: 'Prueba', categoria: 'Pruebas', precio: 1 },
    });
    const productoId = creado.json.data.id;

    // Todas las altas de favoritos y el borrado del producto se lanzan a la vez.
    const altas = tokens.map((token) => peticion('POST', '/favoritos', { token, cuerpo: { productoId } }));
    await new Promise((r) => setTimeout(r, intento % 4));
    const borrado = peticion('DELETE', `/productos/${productoId}`, { token: tokenAdmin });
    await Promise.all([...altas, borrado]);

    // Se mide en la base de datos antes de listar, porque listar también limpia huérfanos.
    (await buscarHuerfanos(idsUsuarios)).forEach((id) => huerfanosEnBD.add(id));

    for (const token of tokens) {
      const lista = await peticion('GET', '/favoritos', { token });
      lista.json.data.filter((f) => f.producto === null).forEach((f) => respuestasConProductoNulo.add(f.id));
    }
  }

  // Limpieza de los usuarios temporales de la prueba.
  await Favorito.deleteMany({ usuario: { $in: idsUsuarios } });
  await Usuario.deleteMany({ correo: patronCorreos });

  console.log(`Intentos: ${INTENTOS} · usuarios concurrentes: ${USUARIOS}`);
  console.log(`Favoritos huérfanos encontrados en la base de datos: ${huerfanosEnBD.size}`);
  console.log(`Favoritos con "producto": null en las respuestas: ${respuestasConProductoNulo.size}`);
  const ok = huerfanosEnBD.size === 0 && respuestasConProductoNulo.size === 0;
  console.log(ok ? 'RESULTADO: datos consistentes.' : 'RESULTADO: hay referencias huérfanas.');
  process.exitCode = ok ? 0 : 1;
}

main()
  .catch((err) => {
    console.error('Error en la prueba de concurrencia:', err.message);
    process.exitCode = 1;
  })
  .finally(desconectarDB);
