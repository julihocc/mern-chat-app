// backend\src\graphql\resolvers\mutations\signUp.js

const { UserInputError } = require("apollo-server-express");
const User = require('../../models/UserModel');
const jwt = require('jsonwebtoken');
const {encryptPassword} = require('../utils');
const logger = require('../../logger');

const signUp = async (parent, { email, username, password, confirmPassword }) => {

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
        logger.error('Email already in use'); // Log this error
        throw new UserInputError('Email already in use');
    }

    // Check if username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
        logger.error('Username already in use'); // Log this error
        throw new UserInputError('Username already in use');
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        logger.error("Passwords don't match"); // Log this error
        throw new UserInputError("Passwords don't match");
    }

    const hashedPassword = await encryptPassword(password);
    const user = new User({ email, username, password: hashedPassword });

    try {
        await user.save();
        //logger.info(`User created with id: ${user.id}`); // Log this info
    } catch (err) {
        logger.error(`Failed to save user: ${err}`); // Log this error
    }

    const token = jwt.sign({
        id: user.id, email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token, user };
};

module.exports = {signUp};
