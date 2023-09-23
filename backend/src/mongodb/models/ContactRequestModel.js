const mongoose = require('mongoose');

const ContactRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
    }, recipient: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
    }, status: {
        type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending',
    },  createdAt: {
        type: Date, default: Date.now,
    }
});

const ContactRequestModel = mongoose.model('ContactRequestModel', ContactRequestSchema);

module.exports = ContactRequestModel;
