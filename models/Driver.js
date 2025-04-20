import mongoose from "mongoose";
import BaseUser from "./BaseUser.js";

const driverSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  image: { type: String },
  mobileNumber: { type: String, required: false },
  CNIC: { type: String, required: false },
  phoneNumber: { type: String },
  dob: { type: Date, required: false },
  documents: {
    idCardFront: { type: String, required: false },
    idCardBack: { type: String, required: false },
    drivingLicense: { type: String, required: false },
    vehicleInsurance: { type: String, required: false },
    vehiclePhotos: [{ type: String }],
  },
  vehicle: {
    model: { type: String, default: "N/A" },
    isAC: {
      type: String,
      default: "N/A",
    },
    numberOfPassengers: {
      type: String,
      default: "N/A",
    },
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    required: true,
    default: "pending",
  },
});

const Driver = BaseUser.discriminator("Driver", driverSchema);
export default Driver;
