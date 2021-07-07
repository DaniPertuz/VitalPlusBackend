const { getLastPayment } = require("./dbValidators");

const paymentMethods = (value, method = '') => {
    switch (method) {
        case 'CREDITO':
            return (value - ((value * 0.055) / 100));
        case 'DEBITO':
            return (value - ((value * 0.046) / 100));
        case 'EFECTIVO':
            return value;
    }
}

const processPayment = async (value, method = '', type, patient, procedure) => {

    const totalPayment = paymentMethods(value, method);
    const { id: procedureID, name, value: valueProcedure, type: procedureType } = procedure, { id: patientID } = patient;
    const firstPayment = valueProcedure - totalPayment;

    if (type === 'INICIAL') {
        if (procedureType !== 'TRATAMIENTO') {
            return { result: `No es necesaria una cuota inicial por este concepto.` };
        } else if (totalPayment > valueProcedure) {
            return { result: `El valor de la cuota inicial excede al valor total del ${name}.` };
        } else {
            return { result: firstPayment };
        }
    } else {
        const payment = await getLastPayment(patientID, procedureID);

        if (payment.length === 0) {
            return { result: firstPayment };
        } else {
            const { balance } = payment[0];

            if (balance > 0 && totalPayment > balance) {
                return { result: `El valor del abono excede al saldo pendiente.` };
            }

            if (totalPayment > valueProcedure) {
                return { result: `El valor del abono excede al valor total del ${name}.` };
            }

            if (balance === 0) {
                return { result: firstPayment };
            } else {
                return { result: balance - totalPayment };
            }

        }
    }
}

module.exports = { paymentMethods, processPayment };