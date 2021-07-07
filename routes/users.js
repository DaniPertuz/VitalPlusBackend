const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/user');
const { emailExists, validUserID } = require('../helpers/dbValidators');
const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const router = Router();

router.get('/', getUsers);

router.get('/:email', getUser);

router.post('/', [
    check('name', 'No se ingresó nombre de usuario').not().isEmpty(),
    check('password', 'No se ingresó contraseña para este usuario').not().isEmpty(),
    check('email').custom(emailExists),
    check('role').isIn(['ADMIN', 'AGENT']),
    validateFields
], createUser);

router.put('/:id', [
    // check('id', 'No es un ID válido').isMongoId(),
    check('name', 'No se ingresó nombre de usuario').not().isEmpty(),
    check('password', 'No se ingresó contraseña para este usuario').not().isEmpty(),
    check('role').isIn(['ADMIN', 'AGENT']),
    check('id').custom(validUserID),
    validateFields
], updateUser);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(validUserID),
    validateFields
], deleteUser);

module.exports = router;