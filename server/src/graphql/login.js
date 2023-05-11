const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {comparePassword} = require('./utils');

const login = async (parent, {email, password}) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Invalid email');
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
        throw new Error('Invalid password');
    }
    const payload = {id: user._id, email: user.email};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});
    return {
        token, user
    };
};

module.exports = login;
