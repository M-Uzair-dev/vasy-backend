import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    kmChange: { type: Number, required: true },
    commissionType: { type: String, required: true },
    peakSurcharge: { type: Number, required: true },
    weightLimit: { type: Number, required: true },
    tax: { type: Number, required: true },
    adminCommission: { type: Number, required: true },
    biddingSystem: { type: Boolean, default: false },
    image: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
