// UserController.js
const User = require('../models/UserModel');

const getUserByEmail = async (req, res) => {
	try {
		const email = req.params.email;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

module.exports = {
	getUserByEmail,
};
