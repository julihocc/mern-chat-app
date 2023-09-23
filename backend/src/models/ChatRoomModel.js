// backend/models/ChatRoomModel.js
const { Schema, model } = require('mongoose');

function arrayLimit(val) {
    //logger.info(`arrayLimit: val: ${val}`); // Replace console.log with //logger.info
    return val.length >= 2;
}

const chatRoomSchema = new Schema(
    {
        participants: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            validate: [arrayLimit, '{PATH} must have at least two participants.'],
        },
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Message',
            },
        ],
    },
    { timestamps: true }
);

module.exports = model('ChatRoom', chatRoomSchema);
