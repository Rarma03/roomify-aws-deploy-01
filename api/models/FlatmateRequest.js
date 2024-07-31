const mongoose = require('mongoose');

const flatmateRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    introduction: {
        type: String,
        required: true,
    },
    preferenceType: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['girl', 'boy', 'girl or boy'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const FlatmateRequest = mongoose.model('FlatmateRequest', flatmateRequestSchema);

module.exports = FlatmateRequest;
