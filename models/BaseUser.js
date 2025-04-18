import mongoose from "mongoose";
const { Schema } = mongoose;

const baseUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    name: { type: String, required: false },
    role: {
      type: String,
      required: true,
      enum: ["superadmin", "admin", "client", "driver", "agent", "restaurant"],
    },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
  },
  { discriminatorKey: "userType", timestamps: true }
);

const BaseUser = mongoose.model("BaseUser", baseUserSchema);
export default BaseUser;
