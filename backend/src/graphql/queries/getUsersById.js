const logger = require("../../logger");
const User = require("../../models/UserModel");
     const getUsersById= async (parent, {userIds}) => {
    logger.info("Calling getUsersById", userIds)
    const users = await User.find({_id: {$in: userIds}});
    logger.info('users', !!users)
    return users;
}
module.exports = {getUsersById};
