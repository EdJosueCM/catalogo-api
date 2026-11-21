const ApiError = require('../utils/ApiError');

function rutaNoEncontrada(req, _res, next) {
  next(ApiError.noEncontrado(`No existe la ruta ${req.method} ${req.path}`));
}

// Manejador central: convierte cualquier error en { ok: false, error: {...} }
// sin exponer trazas, consultas ni secretos.
// eslint-disable-next-line no-unused-vars
function manejadorErrores(err, _req, res, _next) {
  let error = err;

  if (err.type === 'entity.parse.failed') {
    error = ApiError.solicitudInvalida('El cuerpo de la petición no es JSON válido');
  } else if (err.type === 'entity.too.large') {
    error = ApiError.solicitudInvalida('El cuerpo de la petición es demasiado grande');
  } else if (err.code === 11000) {
    // Índice único de MongoDB violado (correo, nombre de producto o favorito repetido).
    error = ApiError.conflicto('El registro ya existe');
  } else if (err.name === 'ValidationError') {
    const detalles = Object.fromEntries(Object.entries(err.errors).map(([campo, e]) => [campo, e.message]));
    error = ApiError.solicitudInvalida('Datos inválidos', detalles);
  } else if (err.name === 'CastError') {
    error = ApiError.solicitudInvalida('Datos inválidos', { [err.path]: 'Valor con formato incorrecto' });
  }

  if (!(error instanceof ApiError)) {
    console.error(err);
    error = new ApiError(500, 'ERROR_INTERNO', 'Ocurrió un error inesperado');
  }

  const cuerpo = { ok: false, error: { codigo: error.codigo, mensaje: error.message } };
  if (error.detalles) cuerpo.error.detalles = error.detalles;
  res.status(error.status).json(cuerpo);
}

module.exports = { rutaNoEncontrada, manejadorErrores };
