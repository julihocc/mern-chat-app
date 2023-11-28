const logger = require("../../utils/logger");
const {AuthenticationError} = require('apollo-server-express');
const yup = require('yup');

const sendContactRequest = async (parent, args, context, info) => {

	const {recipientId} = args

	const schema = yup.object().shape({
		recipientId: yup.string().required(),
	})

	try{
		await schema.validate({recipientId})
	} catch(err) {
		logger.error(`Error validating contact request: ${err.message}`)
		throw new AuthenticationError(err.message)
	}

	const {token} = context;

	const sender = await context.dataSources.authAPI.getUserByToken(token);

	if (!sender) {
		logger.error(`Could not find sender for contact request: ${token}`)
		throw new AuthenticationError(`Could not find sender for contact request: ${token}`)
	}

	const recipient = await context.dataSources.authAPI.getUserByEmail(recipientId);

	if(!recipient) {
		logger.error(`Could not find recipient for contact request: ${recipientId}`)
        throw new AuthenticationError(`Could not find recipient for contact request: ${recipientId}`)
	}


}

module.exports = {sendContactRequest}