const { response } = require('express');
const { Procedure, Professional, Patient } = require('../models');
const { getPaymentsByPatient, getPaymentsByProcedure, getPaymentsByProfessional } = require('../helpers');

const collections = [
    'professionals',
    'procedures',
    'patients'
];

const setLapse = (range) => {
    const date = new Date();
    switch (range) {
        case 'year':
            return date.setMonth(date.getMonth() - 12);
        case 'semester':
            return date.setMonth(date.getMonth() - 6);
        case 'month':
            return date.setMonth(date.getMonth() - 1);
        case 'week':
            return date.setDate(date.getDate() - 7);
    }
}

const searchPaymentsByProcedure = async (range, id, res = response) => {
    const procedure = await Procedure.findById(id);

    const dateRange = setLapse(range);

    const payments = await getPaymentsByProcedure(dateRange, procedure);

    res.json(payments);
}

const searchPaymentsByProfessional = async (range, id, res = response) => {
    const professional = await Professional.findById(id);

    const dateRange = setLapse(range);

    const payments = await getPaymentsByProfessional(dateRange, professional);

    res.json(payments);
}

const searchPaymentsByPatient = async (range, id, res = response) => {
    const patient = await Patient.findById(id);

    const dateRange = setLapse(range);

    const payments = await getPaymentsByPatient(dateRange, patient);

    res.json(payments);
}

const search = (req, res = response) => {
    const { collection, range, id } = req.params;

    if (!collections.includes(collection)) {
        return res.status(400).json({
            'msg': `Criterio ${collection} no es válido para consulta.`
        });
    }

    switch (collection) {
        case 'patients':
            searchPaymentsByPatient(range, id, res);
            break;
        case 'procedures':
            searchPaymentsByProcedure(range, id, res);
            break;
        case 'professionals':
            searchPaymentsByProfessional(range, id, res);
            break;

        default:
            res.status(500).json({
                'msg': 'Búsqueda no es válida'
            });
    }

}

module.exports = {
    search
}