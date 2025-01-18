import mongoose from 'mongoose';

const bankSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'BaseUser' },
    bankName: { type: String, required: true },
    branchName: { type: String, required: true },
    holderName: { type: String, required: true },
    accountNo: { type: String, required: true, unique: true },
    ibanNo: { type: String, required: true, unique: true },
    otherInfo: { type: String }
}, { timestamps: true });

const Bank = mongoose.model('Bank', bankSchema);
export default Bank;
