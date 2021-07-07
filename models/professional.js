const { Schema, model } = require('mongoose');

const ProfessionalSchema = Schema({
    document: {
        type: Number,
        unique: true,
        required: [true, 'El número de documento es obligatorio']
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    specialty: {
        type: String,
        required: [true, 'La especialidad del profesional es obligatoria']
    },
    status: { type: Boolean, default: true, required: true }
});

ProfessionalSchema.methods.toJSON = function () {
    const { __v, status, ...data } = this.toObject();
    return data;
}

module.exports = model('Professional', ProfessionalSchema);