// contactService/models/ChatRoomModel.js
const {Schema, model} = require("mongoose");

const chatRoomSchema = new Schema({
	participantIds: {
		type: [{
			type: Schema.Types.ObjectId, ref: "User",
		},],
		validate: {
			validator(this: {status?: string}, val: any) {
				const minimum = this.status === "waiting" ? 1 : 2;
				return Array.isArray(val) && val.length >= minimum;
			},
			message: "{PATH} must have enough participantIds.",
		},
	},
	messageIds: [{
		type: Schema.Types.ObjectId, ref: "Message",
	},],
	groupId: {type: Schema.Types.ObjectId, default: null},
	status: {type: String, enum: ["waiting", "active"]},
	expertId: {type: Schema.Types.ObjectId, default: null},
}, {timestamps: true},);

module.exports = model("ChatRoom", chatRoomSchema);
