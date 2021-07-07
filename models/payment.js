const { Schema, model } = require('mongoose');
// require('@mongoosejs/double');

const PaymentSchema = Schema({
    value: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        required: true,
        enum: ['CREDITO', 'DEBITO', 'EFECTIVO']
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    professional: {
        type: Schema.Types.ObjectId,
        ref: 'Professional',
        required: true
    },
    procedure: {
        type: Schema.Types.ObjectId,
        ref: 'Procedure',
        required: true
    },
    type: {
        type: String,
        enum: ['INICIAL', 'ABONO'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    status: { type: Boolean, default: true, required: true }
});

PaymentSchema.methods.toJSON = function () {
    const { __v, status, ...data } = this.toObject();
    return data;
}

module.exports = model('Payment', PaymentSchema);