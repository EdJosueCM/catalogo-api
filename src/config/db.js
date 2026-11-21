const mongoose = require('mongoose');
const config = require('./env');

// Rechaza filtros con campos que no existen en el esquema.
mongoose.set('strictQuery', true);

async function conectarDB() {
  await mongoose.connect(config.mongoUri);
  // Garantiza que los índices únicos existan antes de recibir peticiones.
  await Promise.all(Object.values(mongoose.models).map((modelo) => modelo.syncIndexes()));
  console.log(`MongoDB conectado: ${mongoose.connection.name}`);
}

async function desconectarDB() {
  await mongoose.disconnect();
}

module.exports = { conectarDB, desconectarDB };
