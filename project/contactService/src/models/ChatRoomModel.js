const {Schema, model} = require("mongoose");

function arrayLimit(val) {
	return val.length >= 2;
}

const chatRoomSchema = new Schema({
	participantIds: {
		type: [{
			type: Schema.Types.ObjectId, ref: "User",
		},], validate: [arrayLimit, "{PATH} must have at least two participantIds."],
	},
}, {timestamps: true},);

module.exports = model("ChatRoom", chatRoomSchema);
