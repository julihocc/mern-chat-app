const {sendMessage} = require("./mutations/sendMessage")
const {getChatRoomById} = require("./queries/getChatRoomById")
const {getMessagesByChatRoomId} = require("./queries/getMessagesByChatRoomId")
const {GraphQLUpload} = require("graphql-upload");
const subscriptions = require("./subscriptions")

const resolvers = {
	Upload: GraphQLUpload, Subscription: subscriptions, Query: {
		getChatRoomById, getMessagesByChatRoomId
	}, Mutation: {
		sendMessage
	}
}

module.exports = {resolvers};

