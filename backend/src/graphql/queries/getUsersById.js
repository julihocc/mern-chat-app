const logger = require("../../logger");
const User = require("../../models/UserModel");

const getUsersById = async (parent, {userIds}) => {
    logger.info("Calling getUsersById", userIds)
    return User.find({_id: {$in: userIds}});
}

module.exports = {getUsersById};
