const {Schema, model} = require("mongoose");

const chunkSchema = new Schema({
	documentId: {type: Schema.Types.ObjectId, ref: "Document", required: true},
	scope: {type: String, required: true, enum: ["group", "school"]},
	groupId: {type: Schema.Types.ObjectId, default: null},
	text: {type: String, required: true},
}, {timestamps: true});

module.exports = model("Chunk", chunkSchema);
