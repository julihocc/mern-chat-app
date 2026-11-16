const {GraphQLError} = require("graphql");

function AuthenticationError(message: any) {
	return new GraphQLError(message, {
		extensions: {code: "UNAUTHENTICATED"},
	});
}

function UserInputError(message: any) {
	return new GraphQLError(message, {
		extensions: {code: "BAD_USER_INPUT"},
	});
}

function ValidationError(message: any) {
	return new GraphQLError(message, {
		extensions: {code: "GRAPHQL_VALIDATION_FAILED"},
	});
}

module.exports = {AuthenticationError, UserInputError, ValidationError};
