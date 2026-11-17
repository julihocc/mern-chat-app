const {Schema, model} = require("mongoose");

const groupSchema = new Schema({
	name: {type: String, required: true, trim: true},
	kind: {type: String, required: true, enum: ["course", "office"]},
	createdBy: {type: Schema.Types.ObjectId, ref: "User", required: true},
}, {timestamps: true});

module.exports = model("Group", groupSchema);
