const { Router } = require('express');
const { check } = require('express-validator');
const { getPayments, getPaymentsByPatient, createPayment, deletePayment } = require('../controllers/payment');
const { validateFields } = require('../middlewares');

const router = Router();

router.get('/', getPayments);
router.get('/patients/:patient', getPaymentsByPatient);

router.post('/', [
    check('value', 'Valor del monto no es numérico').isNumeric(),
    check('type', 'Tipo de abono no válido').isIn(['INICIAL', 'ABONO']),
    check('method', 'Método de pago no válido').isIn(['CREDITO', 'DEBITO', 'EFECTIVO']),
    check('patient', 'Identificación de paciente no válida').isMongoId(),
    check('professional', 'Identificación de profesional no válida').isMongoId(),
    check('procedure', 'Identificación de procedimiento no válida').isMongoId(),
    check('date', 'Formato de fecha no es válida').isDate(),
    validateFields
], createPayment);

router.delete('/:id', [
    validateFields
], deletePayment);

module.exports = router;