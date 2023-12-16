const User = require('../models/UserModel');
const {comparePassword, encryptPassword} = require('../utils/authentication');
const {debug} = require("../utils/logger");

const changePassword = async (req, res) => {
	try {
		const {email, password} = req.body;
		await User.updateOne({email}, {$set: {password: await encryptPassword(password)}});
		const updatedUser = await User.findOne({email});
		debug(`Updated user: ${JSON.stringify(updatedUser)}`);
		res.json(updatedUser);
		return updatedUser;
	} catch (error) {
		res.status(500).json({message: `changePassword error: ${error}`});
	}
}

const getPassword = async (req, res) => {
	debug("AuthService | PasswordController | getPassword");
	const {password, hashed} = req.query;
	debug(`password: ${password}`);
	debug(`hashed: ${hashed}`);
	if (password && hashed) {
		try {
			const result = await comparePassword(password, hashed);
			debug(`comparePassword: ${JSON.stringify(result)}`);
			res.json(result);
			return result;
		} catch (error) {
			res.status(500).json({message: `getPassword error: ${error}`});
		}
	}
	if (password && !hashed) {
		try {
			const hashedPassword = await encryptPassword(password);
			debug(`hashedPassword: ${hashedPassword}`);
			res.json({hashedPassword});
			return hashedPassword;
		} catch (error) {
			res.status(500).json({message: `getPassword error: ${error}`});
		}
	}
}

module.exports = {
	changePassword, getPassword
}