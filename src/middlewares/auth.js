const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');
const usuariosRepo = require('../repositories/usuarios.repository');

// Exige un JWT válido en "Authorization: Bearer <token>".
// Verifica firma y expiración, y carga el usuario desde la base de datos
// para usar su rol actual (no el que diga el cliente).
async function verificarToken(req, _res, next) {
  const [esquema, token] = (req.headers.authorization || '').split(' ');
  if (esquema !== 'Bearer' || !token) {
    throw ApiError.noAutenticado('Falta el token de acceso');
  }

  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw ApiError.noAutenticado('El token ha expirado');
    throw ApiError.noAutenticado('Token inválido');
  }

  const usuario = await usuariosRepo.buscarPorId(payload.sub);
  if (!usuario) throw ApiError.noAutenticado('Token inválido');

  req.usuario = { id: usuario.id, rol: usuario.rol };
  next();
}

// Debe usarse después de verificarToken.
function requerirRol(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.usuario?.rol)) throw ApiError.sinPermiso();
    next();
  };
}

module.exports = { verificarToken, requerirRol };
