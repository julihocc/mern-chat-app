const logger = require("../../logger");
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../utils/utils");
 const getCurrentUser= async (parent, args, context) => {
    logger.info("Calling getCurrentUser")
    const {token} = context;
    logger.info('token', token)

    if (!token) {
        throw new AuthenticationError('You must be logged in');
    }

    const user = await getUserFromToken(token);
    logger.info('user', !!user)

    if (!user) {
        throw new AuthenticationError('Invalid token');
    }

    return user;
}
module.exports = {getCurrentUser};
