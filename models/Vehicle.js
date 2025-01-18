import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const vehicleSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    status: {
        type: String,
        required: true,
        enum: ['active', 'in-active', 'maintenance',],
        default: 'available'
    }
}, {
    timestamps: true
});

const Vehicle = model('Vehicle', vehicleSchema);
export default Vehicle;
