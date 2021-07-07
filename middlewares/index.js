const fieldValidation = require('../middlewares/field-validation');
const validateJWT = require('../middlewares/validate-jwt');
const isAdminRole = require('../middlewares/role-validator');

module.exports = {
    ...fieldValidation,
    ...isAdminRole,
    ...validateJWT
}