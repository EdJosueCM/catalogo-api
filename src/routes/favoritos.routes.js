const { Router } = require('express');
const ctrl = require('../controllers/favoritos.controller');
const { verificarToken } = require('../middlewares/auth');
const { validarAgregarFavorito, validarIdParam } = require('../middlewares/validaciones');

const router = Router();

// Todas las rutas de favoritos requieren un usuario autenticado.
router.use(verificarToken);

router.get('/', ctrl.listar);
router.post('/', validarAgregarFavorito, ctrl.agregar);
router.delete('/:productoId', validarIdParam('productoId'), ctrl.quitar);

module.exports = router;
