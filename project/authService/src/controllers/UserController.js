// UserController.js
const User = require('../models/UserModel');
const {comparePassword, getUserFromToken} = require('../utils/authentication');
const {debug} = require("../utils/logger");
const {sign} = require("jsonwebtoken");

const getUserByEmail = async (req, res) => {
	debug("getUserByEmail")
	try {
		const email = req.body.email;
		debug(`email: ${email}`);
		const user = await User.findOne({email});
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}
		res.json(user);
		return user;
	} catch (error) {
		res.status(500).json({message: `Server error: ${error}`});
	}
};

const getPasswordComparison = async (req, res) => {
	try {
		const {password, hashed} = req.body;
		const result = await comparePassword(password, hashed);
		debug(`comparePassword: ${JSON.stringify(result)}`);
		res.json(result);
		return result;
	} catch (error) {
		res.status(500).json({message: `Server error: ${error}`});
	}
}

const getTokenByPayload = async (req, res) => {
	try {
		const {id, email} = req.body;
		const payload = {id, email};
		const token = sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});
		debug(`token: ${token}`);
		res.json({token});
		return token;
	} catch (error) {
		res.status(500).json({message: `Server error: ${error}`});
	}
}

module.exports = {
	getUserByEmail,
	getPasswordComparison,
	getTokenByPayload,
};
