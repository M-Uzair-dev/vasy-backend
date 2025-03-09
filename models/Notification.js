import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BaseUser",
    required: true,
  },
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, required: false, default: "--", trim: true },
  message: { type: String, required: false, default: "", trim: true },
  audience: {
    type: String,
    enum: ["all", "drivers", "restaurants", "users"],
    default: "all",
  },
  image: {
    type: String,
    default: "",
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
