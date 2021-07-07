const { Router } = require('express');
const { check } = require('express-validator');
const { login, revalidateToken } = require('../controllers/auth');
const { validateFields, validateJWT } = require('../middlewares');

const router = Router();

router.post('/login', [
    check('username', 'Nombre de usuario es obligatorio').not().isEmpty(),
    check('password', 'Contraseña es obligatoria').not().isEmpty(),
    validateFields
], login);

router.get('/renew', validateJWT, revalidateToken);

module.exports = router;