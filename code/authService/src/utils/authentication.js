// contactService\src\graphql\resolvers\hooks\hooksHub.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const logger = require("./logger");
const saltRounds = 10;

const encryptPassword = async (password) => {
	return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};

const retrieveUserByToken = async (token) => {
	logger.debug(`retrieveUserByToken: ${token}`);
	const tokenString = token.split(" ")[1];
	logger.debug(`tokenString: ${tokenString}`);

	const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
	logger.debug(`decoded: ${JSON.stringify(decoded)}`);

	try {
		const user = await User.findById(decoded.id);
		logger.debug(`getUserFromToken: ${JSON.stringify(user)}`)
		return user;
	} catch (err) {
		throw new Error(err);
	}

};

module.exports = {encryptPassword, comparePassword, retrieveUserByToken};
