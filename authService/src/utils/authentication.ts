// contactService\src\graphql\resolvers\hooks\hooksHub.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const saltRounds = 10;

const encryptPassword = async (password: any) => {
	return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password: any, hash: any) => {
	return await bcrypt.compare(password, hash);
};

const retrieveUserByToken = async (token: any) => {
	const tokenString = String(token).replace(/^bearer\s+/i, "");
	const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);

	try {
		return await User.findById(decoded.id).select("-password");
	} catch (err: any) {
		throw new Error(err);
	}
};

module.exports = {encryptPassword, comparePassword, retrieveUserByToken};
