const { response } = require('express');
const Professional = require('../models/professional');

const getProfessionals = async (req, res = response) => {
    const { limit, from } = req.query;
    const query = { status: true };

    const [total, professionals] = await Promise.all([
        Professional.countDocuments(query),
        Professional.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        professionals
    });
}

const getProfessional = async (req, res = response) => {
    const { id } = req.params;

    const professional = await Professional.findOne({ document: id });

    res.json(professional);
}

const getProfessionalById = async (id) => {
    return await Professional.findOne({ _id: id });
}

const createProfessional = async (req, res = response) => {
    const { body } = req;

    const professional = new Professional(body);

    await professional.save();

    res.json(professional);
}

const updateProfessional = async (req, res = response) => {
    const { id } = req.params;

    const { __v, ...data } = req.body;

    const professional = await Professional.findByIdAndUpdate(id, data, { new: true });

    res.json(professional);
}

const deleteProfessional = async (req, res = response) => {
    const { id } = req.params;

    const professional = await Professional.findByIdAndUpdate(id, { status: false }, { new: true });

    res.json(professional);
}

module.exports = {
    getProfessionals,
    getProfessional,
    getProfessionalById,
    createProfessional,
    updateProfessional,
    deleteProfessional
}