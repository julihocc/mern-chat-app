const {Schema, model} = require("mongoose");

const documentSchema = new Schema({
	filename: {type: String, required: true},
	scope: {type: String, required: true, enum: ["group", "school"]},
	groupId: {type: Schema.Types.ObjectId, default: null},
	uploadedBy: {type: Schema.Types.ObjectId, required: true},
}, {timestamps: true});

module.exports = model("Document", documentSchema);
