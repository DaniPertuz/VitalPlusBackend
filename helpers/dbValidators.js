const { User, Professional, Procedure, Patient, Payment } = require('../models');

const getLastPayment = async (patient, procedure) => {
    const lastPayment = await Payment.find({ procedure, patient }).sort({ date: -1 }).limit(1);

    return lastPayment;
}

const getInitialFee = async (patient, procedure, typeFee) => {
    const { type } = await getProcedure(procedure);
    if (type === 'TRATAMIENTO' && typeFee === 'INICIAL') {
        const payment = await Payment.findOne({ patient, procedure, type: 'INICIAL' });
        return payment;
    }
}

const validBalance = async (patient, procedure, typeFee) => {
    const { value, type } = await getProcedure(procedure);
    const payment = await getLastPayment(patient, procedure);

    if (payment.length === 0) {
        return { balance: null };
    } else {
        const { balance } = payment[0];
        if (balance === 0) {
            if (type === 'TRATAMIENTO') {
                if (typeFee !== 'INICIAL') {
                    return { balance: null };
                }
            } else {
                return { balance: value };
            }
        } else {
            return { balance };
        }
    }
}

const getProcedure = async (id) => {
    const procedure = await Procedure.findById({ _id: id });

    return procedure;
}

const getPaymentsByPatient = async (lapse, { _id: patientID }) => {
    const [total, payments] = await Promise.all([
        await Payment.find({
            $and: [{ patient: patientID }, { date: { $gte: lapse } }]
        }).countDocuments(),
        await Payment.find({
            $and: [{ patient: patientID }, { date: { $gte: lapse } }]
        })
        .populate('patient', 'name')
        .populate('professional', 'name')
        .populate('procedure', 'name value')
    ]);

    return { total, payments };
}

const getPaymentsByProcedure = async (lapse, { _id: procedureID }) => {
    const [total, payments] = await Promise.all([
        await Payment.find({
            $and: [{ procedure: procedureID }, { date: { $gte: lapse } }]
        }).countDocuments(),
        await Payment.find({
            $and: [{ procedure: procedureID }, { date: { $gte: lapse } }]
        })
        .populate('professional', 'name')
    ]);

    return { total, payments };
}

const getPaymentsByProfessional = async (lapse, { _id: professionalID }) => {
    const [total, payments] = await Promise.all([
        await Payment.find({
            $and: [{ professional: professionalID }, { date: { $gte: lapse } }]
        }).countDocuments(),
        await Payment.find({
            $and: [{ professional: professionalID }, { date: { $gte: lapse } }]
        })
        .populate('procedure', 'name value')
    ]);

    return { total, payments };
}

const emailExists = async (email = '') => {
    const validEmail = await User.findOne({ email });
    if (validEmail) {
        throw new Error(`El correo ${email} ya existe.`);
    }
}

const validUserID = async (id) => {
    const validUser = await User.findById({ _id: id });
    if (!validUser) {
        throw new Error(`El usuario ${_id} no existe`);
    }
}

const patientExists = async (document = '') => {
    const validPatient = await Patient.findOne({ document });
    if (validPatient) {
        throw new Error(`El número de documento ${document} ya existe.`);
    }
}

const professionalExists = async (document = '') => {
    const validProfessional = await Professional.findOne({ document });
    if (validProfessional) {
        throw new Error(`El número de documento ${document} ya existe.`);
    }
}

const procedureExists = async (id) => {
    const validProfessional = await Professional.findById({ id });
    if (validProfessional) {
        throw new Error(`El número de documento ${document} ya existe.`);
    }
}

const professionalExistsByID = async (id) => {
    const validProfessional = await Professional.findById({ _id: id });
    if (!validProfessional) {
        throw new Error(`El código del profesional ${id} no existe.`);
    }
}

const validProfessionalID = async (id) => {
    const validProfessional = await Professional.findById({ _id: id });
    if (!validProfessional) {
        throw new Error(`El profesional ${id} no existe`);
    }
}

const validProcedureID = async (id) => {
    const validProcedure = await Procedure.findById({ _id: id });
    if (!validProcedure) {
        throw new Error(`El procedimiento ${id} no existe`);
    }
}

module.exports = {
    getInitialFee,
    getLastPayment,
    getProcedure,
    getPaymentsByPatient,
    getPaymentsByProcedure,
    getPaymentsByProfessional,
    emailExists,
    patientExists,
    procedureExists,
    professionalExists,
    professionalExistsByID,
    validBalance,
    validProfessionalID,
    validProcedureID,
    validUserID
}