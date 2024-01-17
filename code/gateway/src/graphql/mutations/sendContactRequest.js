const logger = require("../../utils/logger");
const { AuthenticationError } = require("apollo-server-express");
const yup = require("yup");

const sendContactRequest = async (parent, args, context, info) => {
  logger.debug("Mutations | sendContactRequest");
  const { recipientId } = args;
  logger.debug(`recipientId: ${recipientId}`);

  const schema = yup.object().shape({
    recipientId: yup.string().required(),
  });

  try {
    await schema.validate({ recipientId });
  } catch (err) {
    logger.error(`Error validating contact request: ${err.message}`);
    throw new AuthenticationError(err.message);
  }

  const { token } = context;
  logger.debug(`token: ${token}`);

  if (!token) {
    logger.error(`Could not find token for contact request: ${token}`);
    throw new AuthenticationError(
      `Could not find token for contact request: ${token}`
    );
  }

  const sender = await context.dataSources.authAPI.getUserByToken(token);
  logger.debug(`sender: ${JSON.stringify(sender)}`);

  if (!sender) {
    logger.error(`Could not find sender for contact request: ${token}`);
    throw new AuthenticationError(
      `Could not find sender for contact request: ${token}`
    );
  }

  const recipient = await context.dataSources.authAPI.getUserById(recipientId);
  logger.debug(`recipient: ${JSON.stringify(recipient)}`);

  if (!recipient) {
    logger.error(
      `Could not find recipient for contact request: ${recipientId}`
    );
    throw new AuthenticationError(
      `Could not find recipient for contact request: ${recipientId}`
    );
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
    context.pubSub.publish(`NEW_CONTACT_REQUEST`, {
      newContactRequest: contactRequest,
    });
    return contactRequest;
  } catch (err) {
    logger.error(`Error sending contact request: ${err.message}`);
    throw new Error(`Error sending contact request: ${err.message}`);
  }
};

module.exports = { sendContactRequest };
