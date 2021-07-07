const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { _id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Read user by _id
        const user = await User.findById(_id);

        // Verify if user exists
        if (!user) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en Base de Datos'
            });
        }

        // Verify if _id is active
        if (!user.status) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no activo'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validateJWT
}