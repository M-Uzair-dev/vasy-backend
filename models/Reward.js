import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: Number,
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    }
}, { timestamps: true });

const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;
