const { Router } = require('express');
const { check } = require('express-validator');
const { getPatients, getPatientByDocument, createPatient, updatePatient, deletePatient } = require('../controllers/patient');
const { patientExists, validProfessionalID, validProcedureID, professionalExistsByID } = require('../helpers/dbValidators');
const { validateFields, validateJWT, isAdminRole } = require('../middlewares');

const router = Router();

router.get('/', getPatients);

router.get('/:document', getPatientByDocument);

router.post('/', [
    check('name', 'Nombre del paciente es obligatorio').not().isEmpty(),
    check('document', 'Número de documento del paciente es obligatorio').not().isEmpty(),
    check('document', 'Número de documento no es un número').isNumeric(),
    check('phone', 'Número de teléfono del paciente es obligatorio').not().isEmpty(),
    check('phone', 'Número de teléfono no es un número').isNumeric(),
    check('phone', 'Número de teléfono no es válido').isLength({ min: 7 }),
    check('address', 'Dirección del paciente es obligatoria').not().isEmpty(),
    check('dateOfBirth', 'Fecha de nacimiento del paciente es obligatoria').not().isEmpty(),
    check('dateOfBirth', 'Fecha de nacimiento del paciente no es válida').isDate(),
    check('procedure', 'Procedimiento del paciente es obligatorio').not().isEmpty(),
    check('procedure', 'ID de procedimiento no válido').isMongoId(),
    check('procedure').custom(validProcedureID),
    check('professional', 'Profesional asignado al paciente es obligatorio').not().isEmpty(),
    check('professional', 'ID de profesional no válido').isMongoId(),
    check('professional').custom(professionalExistsByID),
    check('transferred', 'Estado de remisión del paciente es obligatoria').not().isEmpty(),
    check('transferred', 'Remisión no válida').isBoolean(),
    check('document').custom(patientExists),
    validateFields
], createPatient);

router.put('/:id', [
    check('professional').custom(validProfessionalID),
    check('procedure').custom(validProcedureID),
    validateFields
], updatePatient);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    validateFields
], deletePatient);

module.exports = router;