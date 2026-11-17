const {Schema, model} = require("mongoose");

const markedAnswerSchema = new Schema({
	groupId: {type: Schema.Types.ObjectId, required: true},
	questionText: {type: String, required: true},
	answerText: {type: String, required: true},
	messageId: {type: Schema.Types.ObjectId, required: true},
	markedBy: {type: Schema.Types.ObjectId, required: true},
}, {timestamps: true});

module.exports = model("MarkedAnswer", markedAnswerSchema);
