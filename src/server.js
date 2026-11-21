const config = require('./config/env');
const app = require('./app');
const { conectarDB } = require('./config/db');

async function iniciar() {
  try {
    await conectarDB();
    app.listen(config.port, () => {
      console.log(`API escuchando en http://localhost:${config.port}/api`);
    });
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  }
}

iniciar();
