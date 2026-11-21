const { isValidObjectId } = require('mongoose');
const ApiError = require('../utils/ApiError');

const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Solo se aceptan cadenas: evita que lleguen objetos como { "$gt": "" } a MongoDB.
function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function lanzarSiHayErrores(errores) {
  if (Object.keys(errores).length > 0) {
    throw ApiError.solicitudInvalida('Datos inválidos', errores);
  }
}

// Construye req.datos únicamente con los campos permitidos; el resto se ignora.

function validarRegistro(req, _res, next) {
  const body = req.body ?? {};
  const datos = { nombre: texto(body.nombre), correo: texto(body.correo).toLowerCase(), password: body.password };
  const errores = {};

  if (!datos.nombre) errores.nombre = 'El nombre es obligatorio';
  else if (datos.nombre.length > 80) errores.nombre = 'El nombre admite como máximo 80 caracteres';

  if (!datos.correo) errores.correo = 'El correo es obligatorio';
  else if (!CORREO_REGEX.test(datos.correo) || datos.correo.length > 120) errores.correo = 'El correo no es válido';

  if (typeof datos.password !== 'string' || datos.password.length < 8) {
    errores.password = 'La contraseña es obligatoria y debe tener al menos 8 caracteres';
  } else if (datos.password.length > 72) {
    errores.password = 'La contraseña admite como máximo 72 caracteres';
  }

  lanzarSiHayErrores(errores);
  req.datos = datos;
  next();
}

function validarLogin(req, _res, next) {
  const body = req.body ?? {};
  const datos = { correo: texto(body.correo).toLowerCase(), password: body.password };
  const errores = {};

  if (!datos.correo) errores.correo = 'El correo es obligatorio';
  else if (!CORREO_REGEX.test(datos.correo)) errores.correo = 'El correo no es válido';
  if (typeof datos.password !== 'string' || !datos.password) errores.password = 'La contraseña es obligatoria';

  lanzarSiHayErrores(errores);
  req.datos = datos;
  next();
}

// PUT reemplaza el producto completo, así que se exigen los mismos campos que en POST.
function validarProducto(req, _res, next) {
  const body = req.body ?? {};
  const datos = {
    nombre: texto(body.nombre),
    descripcion: texto(body.descripcion),
    categoria: texto(body.categoria),
    precio: body.precio,
  };
  const errores = {};

  if (!datos.nombre) errores.nombre = 'El nombre es obligatorio';
  else if (datos.nombre.length > 100) errores.nombre = 'El nombre admite como máximo 100 caracteres';

  if (!datos.descripcion) errores.descripcion = 'La descripción es obligatoria';
  else if (datos.descripcion.length > 500) errores.descripcion = 'La descripción admite como máximo 500 caracteres';

  if (!datos.categoria) errores.categoria = 'La categoría es obligatoria';
  else if (datos.categoria.length > 50) errores.categoria = 'La categoría admite como máximo 50 caracteres';

  if (typeof datos.precio !== 'number' || !Number.isFinite(datos.precio) || datos.precio <= 0) {
    errores.precio = 'El precio es obligatorio y debe ser un número mayor que cero';
  }

  lanzarSiHayErrores(errores);
  req.datos = datos;
  next();
}

function validarAgregarFavorito(req, _res, next) {
  const productoId = (req.body ?? {}).productoId;
  if (typeof productoId !== 'string' || !isValidObjectId(productoId)) {
    throw ApiError.solicitudInvalida('Datos inválidos', { productoId: 'Debe ser un identificador de producto válido' });
  }
  req.datos = { productoId };
  next();
}

function validarFiltroProductos(req, _res, next) {
  const { categoria } = req.query;
  if (categoria !== undefined && (typeof categoria !== 'string' || !categoria.trim())) {
    throw ApiError.solicitudInvalida('Datos inválidos', { categoria: 'La categoría debe ser un texto no vacío' });
  }
  req.filtro = { categoria: categoria?.trim() };
  next();
}

// Valida un parámetro de ruta que debe ser un ObjectId de MongoDB.
function validarIdParam(nombre) {
  return (req, _res, next) => {
    if (!isValidObjectId(req.params[nombre])) {
      throw ApiError.solicitudInvalida('Datos inválidos', { [nombre]: 'El identificador no es válido' });
    }
    next();
  };
}

module.exports = {
  validarRegistro,
  validarLogin,
  validarProducto,
  validarAgregarFavorito,
  validarFiltroProductos,
  validarIdParam,
};
