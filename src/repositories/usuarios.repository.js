const Usuario = require('../models/Usuario');

function buscarPorCorreoConHash(correo) {
  return Usuario.findOne({ correo }).select('+passwordHash');
}

function buscarPorId(id) {
  return Usuario.findById(id);
}

function crear({ nombre, correo, passwordHash, rol = 'usuario' }) {
  return Usuario.create({ nombre, correo, passwordHash, rol });
}

module.exports = { buscarPorCorreoConHash, buscarPorId, crear };
