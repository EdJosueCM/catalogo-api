const Producto = require('../models/Producto');
const { COLACION } = require('../models/Producto');
const Favorito = require('../models/Favorito');

function listar({ categoria } = {}) {
  const filtro = categoria ? { categoria } : {};
  return Producto.find(filtro).collation(COLACION).sort({ nombre: 1 });
}

function buscarPorId(id) {
  return Producto.findById(id);
}

function crear(datos) {
  return Producto.create(datos);
}

function reemplazar(id, datos) {
  return Producto.findByIdAndUpdate(id, datos, { returnDocument: 'after', runValidators: true });
}

// Borrado en cascada: al eliminar un producto también se eliminan los
// favoritos que lo referencian, para no dejar referencias huérfanas.
async function eliminar(id) {
  const producto = await Producto.findByIdAndDelete(id);
  if (!producto) return null;
  const { deletedCount } = await Favorito.deleteMany({ producto: id });
  return { producto, favoritosEliminados: deletedCount };
}

module.exports = { listar, buscarPorId, crear, reemplazar, eliminar };
