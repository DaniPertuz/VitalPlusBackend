const { response } = require('express');
const { Patient } = require('../models');
const { getProcedureById } = require('./procedure');
const { getProfessionalById } = require('./professional');

const getPatients = async (req, res = response) => {

    const { limit, from } = req.query;
    const query = { status: true };

    const [total, patients] = await Promise.all([
        Patient.countDocuments(query),
        Patient.find(query)
            .populate('procedure', 'name')
            .populate('professional', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        patients
    });
}

const getPatientByDocument = async (req, res = response) => {
    const { document } = req.params;

    const patientDB = await Patient.findOne({ document });

    res.json(patientDB);
}

const createPatient = async (req, res = response) => {

    const { body } = req;

    const document = body.document;

    const patientDB = await Patient.findOne({ document });

    if (patientDB) {
        return res.status(400).json({
            msg: `Número de documento ${patientDB.document} ya existe`
        });
    }

    const patient = new Patient(body);

    await patient.save();

    res.json(patient);
}

const updatePatient = async (req, res = response) => {

    const { id } = req.params;

    const { __v, ...data } = req.body;

    const patient = await Patient.findByIdAndUpdate({ _id: id }, data, { new: true });

    const { procedure, professional } = patient;

    const procedureObj = await getProcedureById(procedure);
    const professionalObj = await getProfessionalById(professional);

    patient.procedure = procedureObj;
    patient.professional = professionalObj;

    res.json(patient);
}

const deletePatient = async (req, res = response) => {
    const { id } = req.params;
    const patient = await Patient.findOneAndUpdate({ _id: id }, { status: false }, { new: true });


    res.json(patient);
}

module.exports = {
    getPatients,
    getPatientByDocument,
    createPatient,
    updatePatient,
    deletePatient
}