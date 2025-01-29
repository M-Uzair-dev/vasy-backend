import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['credit', 'debit', 'cash', 'wallet'],
        required: true
    },
    paymentTo: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'recipientType', // Dynamic reference to Restaurant or Driver
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },

    paidAt: {
        type: Date
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
