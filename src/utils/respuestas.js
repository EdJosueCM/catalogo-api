// Formato único para respuestas exitosas: { ok: true, data, mensaje? }
function enviar(res, status, data, mensaje) {
  const cuerpo = { ok: true };
  if (mensaje) cuerpo.mensaje = mensaje;
  if (data !== undefined) cuerpo.data = data;
  return res.status(status).json(cuerpo);
}

module.exports = { enviar };
