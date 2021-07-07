const { Router } = require('express');
const { check } = require('express-validator');
const { getProcedures, getProcedure, createProcedure, updateProcedure, deleteProcedure } = require('../controllers/procedure');
const { validProcedureID } = require('../helpers/dbValidators');
const { validateFields, isAdminRole, validateJWT } = require('../middlewares');

const router = Router();

router.get('/', getProcedures);

router.get('/:id', getProcedure);

router.post('/', [
    check('name', 'El nombre de procedimiento es obligatorio').not().isEmpty(),
    check('value', 'El valor del procedimiento es obligatorio').not().isEmpty(),
    check('type', 'El tipo de procedimiento es obligatorio').not().isEmpty(),
    check('type', 'Tipo de procedimiento no válido').isIn(['TRATAMIENTO', 'EXTRA']),
    validateFields
], createProcedure);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(validProcedureID),
    validateFields
], updateProcedure);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(validProcedureID),
    validateFields
], deleteProcedure);

module.exports = router;