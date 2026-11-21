const { Router } = require('express');
const ctrl = require('../controllers/productos.controller');
const { verificarToken, requerirRol } = require('../middlewares/auth');
const { validarProducto, validarFiltroProductos, validarIdParam } = require('../middlewares/validaciones');

const router = Router();
const soloAdmin = [verificarToken, requerirRol('admin')];
const idValido = validarIdParam('id');

// Lectura pública
router.get('/', validarFiltroProductos, ctrl.listar);
router.get('/:id', idValido, ctrl.obtener);

// Escritura solo para administradores (401 sin token, 403 con rol usuario)
router.post('/', soloAdmin, validarProducto, ctrl.crear);
router.put('/:id', soloAdmin, idValido, validarProducto, ctrl.actualizar);
router.delete('/:id', soloAdmin, idValido, ctrl.eliminar);

module.exports = router;
