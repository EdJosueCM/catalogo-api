// Ejecuta la colección de Postman con Newman usando los datos del .env,
// sin escribir secretos en el archivo de entorno.
//
//   node scripts/pruebas-postman.js            -> carpeta "Flujo principal"
//   node scripts/pruebas-postman.js persistencia -> carpeta de persistencia (tras reiniciar)
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const newman = require('newman');

const carpetaPostman = path.join(__dirname, '..', 'postman');
// El entorno con los correos generados se guarda localmente (ignorado por git)
// para que la prueba de persistencia use los mismos usuarios.
const entornoLocal = path.join(carpetaPostman, 'Catalogo.postman_environment.local.json');
const entornoBase = path.join(carpetaPostman, 'Catalogo.postman_environment.json');

const persistencia = process.argv[2] === 'persistencia';
if (persistencia && !fs.existsSync(entornoLocal)) {
  console.error('Primero ejecuta "npm run test:postman" para generar los datos de prueba.');
  process.exit(1);
}

newman.run(
  {
    collection: path.join(carpetaPostman, 'Catalogo.postman_collection.json'),
    environment: persistencia ? entornoLocal : entornoBase,
    folder: persistencia ? 'Persistencia (ejecutar tras reiniciar)' : 'Flujo principal',
    envVar: [
      { key: 'base_url', value: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}` },
      { key: 'admin_correo', value: process.env.ADMIN_CORREO || '' },
      { key: 'admin_password', value: process.env.ADMIN_PASSWORD || '' },
      { key: 'jwt_secret', value: process.env.JWT_SECRET || '' },
    ],
    reporters: ['cli'],
  },
  (err, resumen) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }
    if (!persistencia) {
      // Se guardan solo los datos no secretos que necesita la prueba de persistencia.
      const secretos = new Set(['admin_password', 'jwt_secret', 'admin_correo']);
      const valores = resumen.environment.values
        .all()
        .filter((v) => !secretos.has(v.key))
        .map(({ key, value }) => ({ key, value, enabled: true }));
      fs.writeFileSync(entornoLocal, JSON.stringify({ name: 'Catálogo API - local', values: valores }, null, 2));
    }
    process.exit(resumen.run.failures.length > 0 ? 1 : 0);
  }
);
