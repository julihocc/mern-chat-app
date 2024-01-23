const logger = require("../../utils/logger");
const {
  AuthenticationError,
  ValidationError,
  UserInputError,
} = require("apollo-server-express");
const yup = require("yup");
const pubSub = require("../../utils/pubsub");

const sendContactRequest = async (parent, args, context, info) => {
  logger.debug("Mutations | sendContactRequest");
  const { recipientId } = args;
  logger.debug(`recipientId: ${recipientId}`);

  try {
    const schema = yup.object().shape({
      recipientId: yup.string().required(),
    });

    await schema.validate({ recipientId });
  } catch (valitationError) {
    logger.error(
      `Error validating contact request: ${ValidationError.message}`
    );
    throw new UserInputError("Invalid recipient ID provided");
  }


  try {
    const { token } = context;
    logger.debug(
      `gateway\src\graphql\mutations\sendContactRequest.js | token: ${token}`
    );
    const sender = await context.dataSources.authAPI.getUserByToken(token);
    logger.debug(`sender: ${JSON.stringify(sender)}`);
  } catch (senderError) {
    logger.error(
      `gateway\src\graphql\mutations\sendContactRequest.js \n 
      Error retrieving sender: ${senderError.message}`
    );
  }

  try {
  const recipient = await context.dataSources.authAPI.getUserById(recipientId);
  logger.debug(`recipient: ${JSON.stringify(recipient)}`);
  } catch (recipientError) {
    logger.error(
      `gateway\src\graphql\mutations\sendContactRequest.js \n
      Error retrieving recipient: ${recipientError.message}`
    );
    throw new Error("Error retrieving recipient");
  }


  if (sender._id === recipient._id) {
    throw new Error("You cannot send a contact request to yourself");
  }

  const existingRequest =
    await context.dataSources.contactAPI.getContactRequestsByUsers(
      sender._id,
      recipient._id
    );
  logger.debug(`existingRequest: ${JSON.stringify(existingRequest)}`);

  if (existingRequest) {
    throw new Error("A contact request already exists between these users");
  }

  try {
    const contactRequest =
      await context.dataSources.contactAPI.sendContactRequest(
        sender._id,
        recipient._id
      );
    logger.debug(`contactRequest: ${JSON.stringify(contactRequest)}`);

    ////////////

    pubSub.publish(`NEW_CONTACT_REQUEST`, {
      newContactRequest: contactRequest,
    });

    return contactRequest;
  } catch (err) {
    logger.error(`Error sending contact request: ${err.message}`);
    throw new Error(`Error sending contact request: ${err.message}`);
  }
};

module.exports = { sendContactRequest };
