const {
    UserInputError
} = require("apollo-server-express");
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {encryptPassword} = require('./utils');

const signUp = async (parent, {email, password}) => {
    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new UserInputError('Email already in use');
    }
    const hashedPassword = await encryptPassword(password)
    const user = new User({email: email, password: hashedPassword});
    await user.save();
    const token = jwt.sign({
        id: user.id, email: user.email
    }, process.env.JWT_SECRET, {expiresIn: '1h'});
    return {token, user};
};

module.exports = signUp;

