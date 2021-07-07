const { response } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const getUsers = async (req, res = response) => {
    const { limit, from } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
}

const getUser = async (req, res = response) => {
    const { email: emailUser } = req.params;

    const user = await User.findOne({ email: emailUser });

    res.json(user);
}

const createUser = async (req, res = response) => {
    const { name, email, password, role } = req.body;

    const [userEmail,] = email.split('@');

    const total = await User.countDocuments({ username: userEmail });

    const username = (total > 0) ? `${userEmail}${total + 1}` : userEmail;

    const data = { name, email, username, password, role };
    const user = new User(data);

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.json(user);
}

const updateUser = async (req, res = response) => {
    const { id } = req.params;

    const { password, email, ...data } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        data.password = bcryptjs.hashSync(password, salt);
    }

    const userDB = await User.findByIdAndUpdate(id, data, { new: true });

    res.json({
        userDB
    });
}

const deleteUser = async (req, res = response) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { status: false }, { new: true });

    res.json(user);
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}