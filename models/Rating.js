import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    entity: { type: mongoose.Schema.Types.ObjectId, refPath: 'ratingType', required: true },
    ratingType: {
        type: String,
        required: true,
        enum: ['Driver', 'Restaurant', 'Ride']
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'BaseUser', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
