const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');
const { enviar } = require('../utils/respuestas');
const usuariosRepo = require('../repositories/usuarios.repository');

async function registro(req, res) {
  const { nombre, correo, password } = req.datos;
  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);
  // El rol se fija aquí: el registro público nunca crea administradores.
  const usuario = await usuariosRepo.crear({ nombre, correo, passwordHash, rol: 'usuario' });
  enviar(res, 201, usuario.toJSON(), 'Usuario registrado');
}

async function login(req, res) {
  const { correo, password } = req.datos;
  const usuario = await usuariosRepo.buscarPorCorreoConHash(correo);
  const valido = usuario && (await bcrypt.compare(password, usuario.passwordHash));
  // Mismo mensaje para correo inexistente y contraseña incorrecta.
  if (!valido) throw ApiError.noAutenticado('Credenciales incorrectas');

  const token = jwt.sign({ sub: usuario.id, rol: usuario.rol }, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: config.jwtExpiresIn,
  });
  enviar(res, 200, { token, tipo: 'Bearer', expiraEn: config.jwtExpiresIn, usuario: usuario.toJSON() });
}

module.exports = { registro, login };
