const { Schema, model } = require("mongoose");

const ContactRequestSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  chatRoomId: {
    type: Schema.Types.ObjectId,
    ref: "ChatRoom",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ContactRequestModel = model("ContactRequestModel", ContactRequestSchema);

module.exports = ContactRequestModel;
