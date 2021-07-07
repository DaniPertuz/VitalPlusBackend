const { response } = require('express');
const { User } = require('../models');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers');

const login = async (req, res = response) => {

    const { username, password } = req.body;

    try {

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({
                msg: 'Usuario no es correcto'
            });
        }

        if (!user.status) {
            return res.status(400).json({
                msg: 'Usuario no está activo'
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Contraseña no es correcta'
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            name: user.name,
            username: user.username,
            role: user.role,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const revalidateToken = async (req, res = response) => {

    const { username } = req.user;

    const user = await User.findOne({ username });

    const token = await generateJWT(user._id);

    res.json({
        ok: true,
        username: user.username,
        name: user.name,
        role: user.role,
        token
    })
}

module.exports = {
    login,
    revalidateToken
}