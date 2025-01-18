import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BaseUser',
    },
    totalBalance: {
        type: Number,
        required: true,
        default: 0,
    },
    taxId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tax',
    },
    bankId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank',
    },
});

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
