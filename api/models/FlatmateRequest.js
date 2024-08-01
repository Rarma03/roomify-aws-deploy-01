import mongoose from 'mongoose';

const flatmateRequestSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Places' },
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
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    requestMessage: [{
        requestSender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        user_name: String,
        message: String,
        phone: String,
        connectionStatus: { type: Number, default: 0 },
    }]
});

const FlatmateRequest = mongoose.model('FlatmateRequest', flatmateRequestSchema);

export default FlatmateRequest;
