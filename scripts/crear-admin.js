// Crea (o actualiza) la cuenta de administrador a partir de variables de entorno.
// Es el único camino para obtener el rol "admin": el registro público no lo permite.
//
//   ADMIN_NOMBRE, ADMIN_CORREO y ADMIN_PASSWORD deben estar en .env
const bcrypt = require('bcryptjs');
const config = require('../src/config/env');
const { conectarDB, desconectarDB } = require('../src/config/db');
const Usuario = require('../src/models/Usuario');

async function main() {
  const nombre = process.env.ADMIN_NOMBRE?.trim() || 'Administrador';
  const correo = process.env.ADMIN_CORREO?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!correo || !password || password.length < 8) {
    throw new Error('Define ADMIN_CORREO y ADMIN_PASSWORD (mínimo 8 caracteres) en el archivo .env');
  }

  await conectarDB();
  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);
  const existente = await Usuario.findOne({ correo });

  await Usuario.findOneAndUpdate(
    { correo },
    { nombre, correo, passwordHash, rol: 'admin' },
    { upsert: true, runValidators: true }
  );
  console.log(existente ? `Usuario ${correo} actualizado con rol admin.` : `Administrador ${correo} creado.`);
}

main()
  .catch((err) => {
    console.error('Error al crear el administrador:', err.message);
    process.exitCode = 1;
  })
  .finally(desconectarDB);
