const ApiError = require('../utils/ApiError');
const { enviar } = require('../utils/respuestas');
const favoritosRepo = require('../repositories/favoritos.repository');
const productosRepo = require('../repositories/productos.repository');

// La identidad siempre sale del token verificado (req.usuario), nunca del cuerpo ni de la URL.

async function listar(req, res) {
  const favoritos = await favoritosRepo.listarDeUsuario(req.usuario.id);
  enviar(res, 200, favoritos);
}

async function agregar(req, res) {
  const { productoId } = req.datos;
  const producto = await productosRepo.buscarPorId(productoId);
  if (!producto) throw ApiError.noEncontrado('Producto no encontrado');

  let favorito;
  try {
    favorito = await favoritosRepo.agregar(req.usuario.id, productoId);
  } catch (err) {
    if (err.code === 11000) throw ApiError.conflicto('El producto ya está en tus favoritos');
    throw err;
  }

  // Carrera con DELETE /productos/:id: si el producto se eliminó entre la comprobación
  // inicial y el guardado, populate devuelve null. Se deshace el favorito para no dejar
  // una referencia huérfana.
  if (!favorito.producto) {
    await favoritosRepo.quitar(req.usuario.id, productoId);
    throw ApiError.noEncontrado('Producto no encontrado');
  }
  enviar(res, 201, favorito, 'Producto agregado a favoritos');
}

async function quitar(req, res) {
  const favorito = await favoritosRepo.quitar(req.usuario.id, req.params.productoId);
  // Si el favorito es de otro usuario, para este usuario simplemente no existe.
  if (!favorito) throw ApiError.noEncontrado('El producto no está en tus favoritos');
  enviar(res, 200, { productoId: req.params.productoId }, 'Producto quitado de favoritos');
}

module.exports = { listar, agregar, quitar };
