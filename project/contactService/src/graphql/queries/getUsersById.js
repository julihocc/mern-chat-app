const logger = require("../../utils/logger");
const User = require("../../models/UserModel");

const getUsersById = async (parent, {userIds}) => {
	logger.debug("Calling getUsersById", userIds);
	return User.find({_id: {$in: userIds}});
};

module.exports = {getUsersById};
