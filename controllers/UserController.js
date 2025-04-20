import User from "../models/BaseUser.js";
import { hashPassword, comparePasswords } from "../utils/passwordUtils.js";
import jwt from "jsonwebtoken";
import { generateResetToken } from "../utils/tokenUtils.js";
import { sendResetLinkforReset } from "../utils/emailUtils.js";
import { generateOTP, storeOTP } from "../utils/otpUtils.js";

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      type,
      dateOfBirth,
      phoneNumber,
      CNIC,
    } = req.body;
    const hashedPassword = await hashPassword(password);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      type: type || "CLIENT",
      dateOfBirth: dateOfBirth || "",
      phoneNumber: phoneNumber || "",
      CNIC: CNIC || "", // Added CNIC handling
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await comparePasswords(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ userId: user._id }, "your_jwt_secret"); // No expiration
  res.json({ token });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = generateResetToken(user._id);
  const resetLink = `http://yourfrontend.com/reset-password/${resetToken}`;

  try {
    await sendResetLink(email, resetLink);
    res.json({ message: "Reset link sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    const userId = decoded.userId;
    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
const sendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();
  storeOTP(email, otp);
  const otpMessage = `Your OTP for account verification is: ${otp}`;

  try {
    await sendResetLink(email, otpMessage);
    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const { name, email, password, newPassword, logo, cover, phone } = req.body;
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic information
    if (name) {
      user.name = name;
    }
    if (logo) {
      user.image = logo;
    }
    if (cover) {
      user.cover = cover;
    }
    if (phone) {
      user.phoneNumber = phone;
    }
    console.log("USER", user);
    console.log("LOGO", logo);
    console.log("COVER", cover);
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      user.email = email;
    }

    // Handle password change
    if (newPassword) {
      if (!password) {
        return res
          .status(400)
          .json({ message: "Please provide your current password" });
      }

      // Verify current password
      const isPasswordValid = await comparePasswords(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(202)
          .json({ message: "Current password is incorrect" });
      }

      user.password = await hashPassword(newPassword);
    }
    console.log("USER", user);
    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      type: user.type,
      dateOfBirth: user.dateOfBirth,
      phoneNumber: user.phoneNumber,
      CNIC: user.CNIC,
      ...user,
      ...user?._doc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  sendOTP,
  updateUser,
  getUserDetails,
};
