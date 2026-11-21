// Carga y valida las variables de entorno en un solo lugar.
require('dotenv').config({ quiet: true });

function requerida(nombre) {
  const valor = process.env[nombre];
  if (!valor) {
    console.error(`Falta la variable de entorno ${nombre}. Revisa tu archivo .env (ver .env.example).`);
    process.exit(1);
  }
  return valor;
}

const config = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: requerida('MONGODB_URI'),
  jwtSecret: requerida('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
};

if (config.jwtSecret.length < 32) {
  console.error('JWT_SECRET debe tener al menos 32 caracteres.');
  process.exit(1);
}

module.exports = config;
