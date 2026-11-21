// Error con código HTTP que el manejador central convierte en respuesta JSON.
class ApiError extends Error {
  constructor(status, codigo, mensaje, detalles) {
    super(mensaje);
    this.status = status;
    this.codigo = codigo;
    this.detalles = detalles;
  }

  static solicitudInvalida(mensaje, detalles) {
    return new ApiError(400, 'DATOS_INVALIDOS', mensaje, detalles);
  }

  static noAutenticado(mensaje = 'Se requiere autenticación') {
    return new ApiError(401, 'NO_AUTENTICADO', mensaje);
  }

  static sinPermiso(mensaje = 'No tienes permisos para realizar esta acción') {
    return new ApiError(403, 'SIN_PERMISO', mensaje);
  }

  static noEncontrado(mensaje = 'Recurso no encontrado') {
    return new ApiError(404, 'NO_ENCONTRADO', mensaje);
  }

  static conflicto(mensaje) {
    return new ApiError(409, 'CONFLICTO', mensaje);
  }
}

module.exports = ApiError;
