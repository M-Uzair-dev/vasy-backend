import express from "express";
import {
  createNotification,
  deleteNotification,
  editNotification,
  getAllNotifications,
  getSingleNotification,
  getUserNotifications,
  markAsRead,
} from "../controllers/Notifications/NotificationController.js";

const router = express.Router();
router.get("/all", getAllNotifications);
router.post("/", createNotification);
router.get("/:userId", getUserNotifications);
router.get("/getone/:id", getSingleNotification);
router.patch("/:id/read", markAsRead);
router.patch("/edit/:id", editNotification);
router.delete("/:id", deleteNotification);
export default router;
