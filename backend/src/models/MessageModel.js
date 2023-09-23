// src/models/MessageModel.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: String,
        default: ""
    },
    chatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true
    },
    fileContent: {
        type: String,
        default: null
    },
},
    {timestamps: true}
);

module.exports = mongoose.model('Message', messageSchema);
