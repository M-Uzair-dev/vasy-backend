import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        trim: true
    },
    availability: {
        type: String,
        enum: ['yes', 'no'],
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, {
    timestamps: true
});

export const Zone = mongoose.model('Zone', zoneSchema);
