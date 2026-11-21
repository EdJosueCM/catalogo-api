const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const { validarRegistro, validarLogin } = require('../middlewares/validaciones');

const router = Router();

router.post('/registro', validarRegistro, ctrl.registro);
router.post('/login', validarLogin, ctrl.login);

module.exports = router;
