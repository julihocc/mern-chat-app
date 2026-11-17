const {Schema, model} = require("mongoose");

const membershipSchema = new Schema({
	userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
	groupId: {type: Schema.Types.ObjectId, ref: "Group", required: true},
}, {timestamps: true});

membershipSchema.index({userId: 1, groupId: 1}, {unique: true});

module.exports = model("Membership", membershipSchema);
