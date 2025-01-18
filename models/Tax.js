import mongoose from 'mongoose';

const taxSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BaseUser',
        required: true
    }
}, {
    timestamps: true
});

export const Tax = mongoose.model('Tax', taxSchema);
