const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const saltRounds = 10;

const encryptPassword = async (password) => {
	return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};

const getUserFromToken = async (token) => {
	const tokenString = token.split(" ")[1];
	try {
		const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
		return await User.findById(decoded.id);
	} catch (err) {
		throw new Error(err);
	}
};

module.exports = {encryptPassword, comparePassword, getUserFromToken};
