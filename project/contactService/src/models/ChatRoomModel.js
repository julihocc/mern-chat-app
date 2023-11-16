// contactService/models/ChatRoomModel.js
const {Schema, model} = require("mongoose");
const logger = require("../utils/logger");

function arrayLimit(val) {
	return val.length >= 2;
}

const chatRoomSchema = new Schema({
	participantIds: {
		type: [{
			type: Schema.Types.ObjectId, ref: "User",
		},], validate: [arrayLimit, "{PATH} must have at least two participantIds."],
	}, messageIds: [{
		type: Schema.Types.ObjectId, ref: "Message",
	},],
}, {timestamps: true},);

module.exports = model("ChatRoom", chatRoomSchema);
