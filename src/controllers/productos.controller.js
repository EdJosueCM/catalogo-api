const ApiError = require('../utils/ApiError');
const { enviar } = require('../utils/respuestas');
const productosRepo = require('../repositories/productos.repository');

async function listar(req, res) {
  const productos = await productosRepo.listar(req.filtro);
  enviar(res, 200, productos);
}

async function obtener(req, res) {
  const producto = await productosRepo.buscarPorId(req.params.id);
  if (!producto) throw ApiError.noEncontrado('Producto no encontrado');
  enviar(res, 200, producto);
}

async function crear(req, res) {
  const producto = await productosRepo.crear(req.datos);
  enviar(res, 201, producto, 'Producto creado');
}

async function actualizar(req, res) {
  const producto = await productosRepo.reemplazar(req.params.id, req.datos);
  if (!producto) throw ApiError.noEncontrado('Producto no encontrado');
  enviar(res, 200, producto, 'Producto actualizado');
}

async function eliminar(req, res) {
  const resultado = await productosRepo.eliminar(req.params.id);
  if (!resultado) throw ApiError.noEncontrado('Producto no encontrado');
  enviar(
    res,
    200,
    { id: resultado.producto.id, favoritosEliminados: resultado.favoritosEliminados },
    'Producto eliminado'
  );
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
