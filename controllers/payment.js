const { response } = require('express');
const { paymentMethods, processPayment } = require('../helpers');
const { getInitialFee, validBalance } = require('../helpers/dbValidators');
const { Procedure, Patient, Professional } = require('../models');
const Payment = require('../models/payment');

const getPayments = async (req, res = response) => {
    const { limit, from } = req.query;
    const query = { status: true };

    const [total, payments] = await Promise.all([
        Payment.countDocuments(query),
        Payment.find(query)
            .populate('patient', 'name document')
            .populate('professional', 'name')
            .populate('procedure', 'name type value')
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        payments
    });
}

const getPaymentsByPatient = async (req, res = response) => {
    const { patient } = req.params;

    const paymentsDB = await Payment.find({ status: true })
        .populate('patient', 'name document')
        .populate('professional', 'name')
        .populate('procedure', 'name type value')
        .sort({ 'date': -1 });

    const payments = paymentsDB.filter(payment => payment.patient.document == patient);
    const total = payments.length;

    res.json({
        total,
        payments
    });
}

const createPayment = async (req, res = response) => {
    const { body } = req;

    const value = body.value;
    const method = body.method;
    const patient = body.patient;
    const procedure = body.procedure;
    const professional = body.professional;
    const type = body.type;

    const patientDB = await Patient.findById(patient);
    const procedureDB = await Procedure.findById(procedure);
    const professionalDB = await Professional.findById(professional);

    const initial = await getInitialFee(patient, procedure, type);

    const { balance } = await validBalance(patient, procedure, type);

    const { name: procedureName, type: procedureType } = procedureDB;

    if (balance === null && type !== 'INICIAL' && procedureType === 'TRATAMIENTO') {
        res.status(400).json({
            msg: `Debe registrar la cuota inicial por el tratamiento ${procedureName}.`
        });
    } else if (initial) {
        res.status(400).json({
            msg: `Ya existe cuota inicial por el concepto de ${procedureName}.`
        });
    } else {
        const { result } = await processPayment(value, method, type, patientDB, procedureDB);
        if (isNaN(result)) {
            res.status(400).json({
                msg: result
            });
        } else {
            const data = {
                ...body,
                procedure: procedureDB,
                professional: professionalDB,
                value: paymentMethods(value, method),
                balance: result
            }

            const payment = new Payment(data);

            await payment.save();

            res.json(payment);
        }
    }
}

const deletePayment = async (req, res = response) => {
    const { id } = req.params;

    const payment = await Payment.findByIdAndUpdate(id, { status: false });

    res.json(payment);
}

module.exports = {
    getPayments,
    getPaymentsByPatient,
    createPayment,
    deletePayment
}