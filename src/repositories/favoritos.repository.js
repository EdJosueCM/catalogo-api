const Favorito = require('../models/Favorito');

// Todas las consultas filtran por usuario: nadie puede ver ni tocar favoritos ajenos.

async function listarDeUsuario(usuarioId) {
  const favoritos = await Favorito.find({ usuario: usuarioId }).populate('producto').sort({ agregadoEn: -1 });
  // Red de seguridad: si un favorito quedó apuntando a un producto que ya no existe
  // (por ejemplo, el servidor se detuvo entre los dos borrados), se elimina y no se devuelve.
  const huerfanos = favoritos.filter((f) => !f.producto).map((f) => f._id);
  if (huerfanos.length > 0) await Favorito.deleteMany({ _id: { $in: huerfanos } });
  return favoritos.filter((f) => f.producto);
}

async function agregar(usuarioId, productoId) {
  const favorito = await Favorito.create({ usuario: usuarioId, producto: productoId });
  return favorito.populate('producto');
}

function quitar(usuarioId, productoId) {
  return Favorito.findOneAndDelete({ usuario: usuarioId, producto: productoId });
}

module.exports = { listarDeUsuario, agregar, quitar };
