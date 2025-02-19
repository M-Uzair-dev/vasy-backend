import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive"], // Specify allowed values
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Rule = mongoose.model("Rule", ruleSchema);
export default Rule;
