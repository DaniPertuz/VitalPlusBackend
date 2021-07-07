const { Schema, model } = require('mongoose');

const PatientSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    document: {
        type: Number,
        unique: true,
        required: [true, 'El número de documento es obligatorio']
    },
    phone: {
        type: Number,
        required: [true, 'El teléfono es obligatorio']
    },
    address: {
        type: String,
        required: [true, 'La dirección es obligatoria']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    procedure: {
        type: Schema.Types.ObjectId,
        ref: 'Procedure',
        required: true
    },
    professional: {
        type: Schema.Types.ObjectId,
        ref: 'Professional',
        required: true
    },
    transferred: { type: Boolean, default: true },
    status: { type: Boolean, default: true, required: true },
    img: { type: String }
});

PatientSchema.methods.toJSON = function () {
    const { __v, status, ...data } = this.toObject();
    return data;
}

PatientSchema.statics = {
    isValid(id) {
        return this.findById(id)
        .then(result => {
            if (!result) {
                throw new Error('ID no válido')
            }
        })
    }
}

module.exports = model('Patient', PatientSchema);