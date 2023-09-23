// backend/models/ChatRoomModel.js
const mongoose = require('mongoose');

function arrayLimit(val) {
    return val.length >= 2;
}

const chatRoomSchema = new mongoose.Schema(
    {
        participants: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            // validate: [arrayLimit, '{PATH} must have at least two participants.'],
        },
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message',
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
