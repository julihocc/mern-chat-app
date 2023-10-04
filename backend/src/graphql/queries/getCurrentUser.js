const logger = require("../../logger");
const {AuthenticationError} = require("apollo-server-express");
const {getUserFromToken} = require("../utils");
 const getCurrentUser= async (parent, args, context) => {
    //logger.debug("Calling getCurrentUser")
    const {token} = context;
    //logger.debug('token', token)

    if (!token) {
        throw new AuthenticationError('You must be logged in');
    }

    const user = await getUserFromToken(token);

    if (!user) {
        throw new AuthenticationError('Invalid token');
    }

    return user;
}
module.exports = {getCurrentUser};
