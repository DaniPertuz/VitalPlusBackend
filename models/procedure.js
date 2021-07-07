const { Schema, model } = require('mongoose');

const ProcedureSchema = Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre es obligatorio']
    },
    value: {
        type: Number,
        required: [true, 'El costo del tratamiento o extra es obligatorio'],
    },
    type: {
        type: String,
        required: true,
        enum: ['TRATAMIENTO', 'EXTRA']
    },
    description: {
        type: String,
        required: false
    },
    // patient: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Patient',
    //     required: true
    // },
    status: { type: Boolean, default: true, required: true }
});

ProcedureSchema.methods.toJSON = function () {
    const { __v, status, ...data } = this.toObject();
    return data;
}

module.exports = model('Procedure', ProcedureSchema);