import express from "express";
import {
  getAllUsers,
  getAllClients,
  getSingleUser,
  login,
  register,
  resetPassword,
  sendResetLink,
  updatePassword,
  getDashboardData,
} from "../controllers/AuthController.js";
import { updateUser, getUserDetails } from "../controllers/UserController.js";
import { authenticateUser } from "../middleware/Auth.js";
const router = express.Router();

router.get("/user", authenticateUser, getSingleUser);
router.post("/register", register);
router.post("/login", login);
router.post("/send-link", sendResetLink);
router.post("/reset-password", resetPassword);
router.put("/update-password", authenticateUser, updatePassword);
router.get("/", getAllUsers);
router.post("/clients", getAllClients);
router.get("/dashboard", getDashboardData);
router.put("/update-user", authenticateUser, updateUser);
router.get("/user-details", authenticateUser, getUserDetails);

export default router;
