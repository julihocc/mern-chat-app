const { Schema, model } = require('mongoose');

const ContactRequestSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId, ref: 'User', required: true,
    }, recipient: {
        type: Schema.Types.ObjectId, ref: 'User', required: true,
    }, status: {
        type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending',
    }, chatRoom: {
        type: Schema.Types.ObjectId, ref: 'ChatRoom',
    }, createdAt: {
        type: Date, default: Date.now,
    }
});

const ContactRequestModel = model('ContactRequestModel', ContactRequestSchema);

module.exports = ContactRequestModel;
