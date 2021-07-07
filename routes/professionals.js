const { Router } = require('express');
const { check } = require('express-validator');
const { getProfessionals, getProfessional, createProfessional, updateProfessional, deleteProfessional } = require('../controllers/professional');
const { professionalExists, validProfessionalID } = require('../helpers/dbValidators');
const { validateFields, validateJWT, isAdminRole } = require('../middlewares');

const router = Router();

router.get('/', getProfessionals);

router.get('/:id', getProfessional);

router.post('/', [
    check('document').custom(professionalExists),
    check('name', 'No se ingresó nombre del profesional').not().isEmpty(),
    check('specialty', 'No se ingresó especialidad del profesional').not().isEmpty(),
    validateFields
], createProfessional);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(validProfessionalID),
    validateFields
], updateProfessional);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(validProfessionalID),
    validateFields
], deleteProfessional);

module.exports = router;