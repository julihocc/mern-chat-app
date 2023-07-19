// backend\src\graphql\resolvers\mutations\signUp.js

const {
    UserInputError
} = require("apollo-server-express");
const User = require('../../../models/User');
const jwt = require('jsonwebtoken');
const {encryptPassword} = require('../utils/utils');
const signUp = async (parent, { email, username, password, confirmPassword }) => {

    // Check if email is valid
    // const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;
    if (!email.match(emailValidation)) {
        throw new UserInputError('Email format is incorrect. Please provide a valid email address');
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
        throw new UserInputError('Email already in use');
    }

    // Check if username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
        throw new UserInputError('Username already in use');
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        throw new UserInputError("Passwords don't match");
    }

    const hashedPassword = await encryptPassword(password)
    const user = new User({ email, username, password: hashedPassword });
    await user.save();
    const token = jwt.sign({
        id: user.id, email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user };
};

module.exports = signUp;
