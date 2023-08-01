const logger = require('../../logger');
const User = require('../../models/UserModel');
const { getUserFromToken } = require('../utils/utils');
const { AuthenticationError } = require('apollo-server-express');

const getContactsWithFullDetails = async (parent, args, context) => {
  logger.info('getContactsWithFullDetails()');
  const { token } = context;
  if (!token) {
    throw new AuthenticationError('You must be logged in to get contacts');
  }
const user = await getUserFromToken(token);
  if (!user) {
    throw new AuthenticationError('You must be logged in to get contacts');
  }
  return await User.find({_id: {$in: user.contacts}}).populate('contacts');
};

module.exports = {getContactsWithFullDetails};
