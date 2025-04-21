import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    fareOffered: {
      type: Number,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    status: {
      type: String,
      enum: ["started", "placed", "rejected", "completed", "accepted"],
      default: "started",
    },
    amount: {
      type: Number,
      required: true,
    },
    vehicleTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    distance: {
      from: {
        type: String,
        required: true,
      },
      to: {
        type: String,
        required: true,
      },
      pickupCoordinates: {
        type: [Number],
        required: false,
      },
      dropoffCoordinates: {
        type: [Number],
        required: false,
      },
    },
    dateAndTime: {
      type: Date,
      default: Date.now,
    },
    rideType: {
      type: String,
      enum: ["food", "package", "travel"],
      required: true,
    },
  },
  { timestamps: true }
);

const Ride = mongoose.model("Ride", rideSchema);
export default Ride;
