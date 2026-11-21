const Favorito = require('../models/Favorito');

// Todas las consultas filtran por usuario: nadie puede ver ni tocar favoritos ajenos.

function listarDeUsuario(usuarioId) {
  return Favorito.find({ usuario: usuarioId }).populate('producto').sort({ agregadoEn: -1 });
}

async function agregar(usuarioId, productoId) {
  const favorito = await Favorito.create({ usuario: usuarioId, producto: productoId });
  return favorito.populate('producto');
}

function quitar(usuarioId, productoId) {
  return Favorito.findOneAndDelete({ usuario: usuarioId, producto: productoId });
}

module.exports = { listarDeUsuario, agregar, quitar };
