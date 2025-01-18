import express from "express";
import { getAllUsers, getSingleUser, login, register, resetPassword, sendResetLink, updatePassword } from "../controllers/AuthController.js";
import { authenticateUser } from "../middleware/Auth.js";
const router = express.Router();

router.get('/user', authenticateUser, getSingleUser);
router.post("/register", register);
router.post("/login", login);
router.post('/send-link', sendResetLink);
router.post('/reset-password', resetPassword);
router.put('/update-password', authenticateUser, updatePassword);
router.get('/', getAllUsers);
export default router;