const { response } = require('express');
const { Procedure } = require('../models');

const getProcedures = async (req, res = response) => {
    const { limit, from } = req.query;
    const query = { status: true };

    const [total, procedures] = await Promise.all([
        Procedure.countDocuments(query),
        Procedure.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        procedures
    });
}

const getProcedure = async (req, res = response) => {
    const { id } = req.params;

    const procedure = await Procedure.findById({ _id: id });

    res.json(procedure);
}

const getProcedureById = async (id) => {
    return await Procedure.findById({ _id: id });
}

const createProcedure = async (req, res = response) => {
    const { body } = req;

    const { name } = body;

    const procedureDB = await Procedure.findOne({ name });

    if (procedureDB) {
        return res.status(400).json({
            msg: `Procedimiento ${procedureDB.name} ya existe`
        });
    }

    const procedure = new Procedure(body);

    await procedure.save();

    res.json(procedure);
}

const updateProcedure = async (req, res = response) => {
    const { id } = req.params;

    const { __v, ...data } = req.body;

    const procedure = await Procedure.findByIdAndUpdate(id, data, { new: true });

    res.json(procedure);
}

const deleteProcedure = async (req, res = response) => {
    const { id } = req.params;

    const procedure = await Procedure.findByIdAndUpdate(id, { status: false }, { new: true });

    res.json(procedure);
}

module.exports = {
    getProcedures,
    getProcedure,
    getProcedureById,
    createProcedure,
    updateProcedure,
    deleteProcedure
}