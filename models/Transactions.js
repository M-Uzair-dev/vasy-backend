import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    method: {
      type: String,
      required: true,
      enum: ["credit", "debit", "cash", "wallet"],
    },
    TxnId: {
      type: String,
      required: true,
      unique: true,
    },
    note: {
      type: String,
      required: false,
      default: "--",
    },
    amount: {
      type: Number,
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = model("Transaction", transactionSchema);
export default Vehicle;
