const generateJWT = require('./generateJWT');
const payments = require('./payments');
const dbValidators = require('./dbValidators');

module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...payments
}