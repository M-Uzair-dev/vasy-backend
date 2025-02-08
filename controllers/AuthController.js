import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import Client from "../models/Client.js";
import Driver from "../models/Driver.js";
import Agent from "../models/Agent.js";
import Restaurant from "../models/Restaurant.js";
import Ride from "../models/Ride.js";
import SuperAdmin from "../models/SuperAdmin.js";
import crypto from "crypto";
import { comparePasswords, hashPassword } from "../utils/passwordUtils.js";
import {
  validateCNIC,
  validateDOB,
  validateMobile,
} from "../utils/validators.js";
import { sendResetLinkforReset } from "../utils/emailUtils.js";
import BaseUser from "../models/BaseUser.js";

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (
      ![
        "superadmin",
        "admin",
        "client",
        "driver",
        "agent",
        "restaurant",
      ].includes(role)
    ) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await BaseUser.findOne({ email, role });
    if (!user) {
      return res.status(404).json({
        message: `${role[0].toUpperCase() + role.slice(1)} not found`,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    const { password: _, ...userWithoutPassword } = user.toObject();
    return res.status(200).json({
      message: `${
        role[0].toUpperCase() + role.slice(1)
      } logged in successfully`,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req, res) => {
  const { email, password, role, mobileNumber, dob, CNIC, ...rest } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (mobileNumber && !validateMobile(mobileNumber)) {
    return res.status(400).json({ message: "Invalid mobile number format" });
  }
  if (dob && !validateDOB(dob)) {
    return res
      .status(400)
      .json({ message: "Invalid date of birth format. Use YYYY-MM-DD" });
  }
  if (CNIC && !validateCNIC(CNIC)) {
    return res
      .status(400)
      .json({ message: "Invalid CNIC format. Use XXXXX-XXXXXXX-X" });
  }

  try {
    let existingUser;

    switch (role) {
      case "client":
        existingUser = await Client.findOne({ email });
        break;
      case "driver":
        existingUser = await Driver.findOne({ email });
        break;
      case "superadmin":
        existingUser = await SuperAdmin.findOne({ email });
        break;
      case "admin":
        existingUser = await Admin.findOne({ email });
        break;
      case "agent":
        existingUser = await Agent.findOne({ email });
        break;
      case "restaurant":
        existingUser = await Restaurant.findOne({ email });
        break;
      default:
        return res
          .status(400)
          .json({ message: "Invalid role for registration" });
    }

    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({
        message: `${
          role?.charAt(0)?.toUpperCase() + role?.slice(1)
        } already exists`,
      });
    }

    const hashedPassword = await hashPassword(password);
    let newUser;

    switch (role) {
      case "client":
        newUser = new Client({
          email,
          password: hashedPassword,
          role,
          mobileNumber,
          dob,
          CNIC,
          ...rest,
        });
        break;
      case "driver":
        newUser = new Driver({
          email,
          password: hashedPassword,
          role,
          mobileNumber,
          dob,
          CNIC,
          ...rest,
        });
        break;
      case "superadmin":
        newUser = new SuperAdmin({
          email,
          password: hashedPassword,
          role,
          ...rest,
        });
        break;
      case "admin":
        newUser = new Admin({ email, password: hashedPassword, role, ...rest });
        break;
      case "agent":
        newUser = new Agent({ email, password: hashedPassword, role, ...rest });
        break;
      case "restaurant":
        newUser = new Restaurant({
          email,
          password: hashedPassword,
          role,
          ...rest,
        });
        break;
    }
    await newUser?.save();
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET
    );

    return res.status(201).json({
      message: `${
        role.charAt(0).toUpperCase() + role.slice(1)
      } registered successfully`,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const sendResetLink = async (req, res) => {
  const { email } = req.body;

  try {
    let user = null;
    let role = null;

    const [client, driver, restaurant, admin, superadmin, agent] =
      await Promise.all([
        Client.findOne({ email }),
        Driver.findOne({ email }),
        Restaurant.findOne({ email }),
        Admin.findOne({ email }),
        SuperAdmin.findOne({ email }),
        Agent.findOne({ email }),
      ]);

    if (client) {
      user = client;
      role = "client";
    } else if (driver) {
      user = driver;
      role = "driver";
    } else if (restaurant) {
      user = restaurant;
      role = "restaurant";
    } else if (admin) {
      user = admin;
      role = "admin";
    } else if (superadmin) {
      user = superadmin;
      role = "superadmin";
    } else if (agent) {
      user = agent;
      role = "agent";
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: `User not found for the provided email` });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    console.log("generated token", token);
    const savedUser = await user.save();
    console.log(savedUser);
    const resetToken = `${token}`;

    const subject = "Password Reset Request";
    const message = `
            Hi ${user.name || role}, 
            
            You requested a password reset. here is the token for reset:
            ${savedUser}
            If you did not request this, please ignore this email.
            The link will expire in 1 hour.
        `;

    await sendResetLinkforReset(email, subject, message);
    return res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user =
      (await Client.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      })) ||
      (await Driver.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      })) ||
      (await Admin.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      })) ||
      (await Restaurant.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      })) ||
      (await SuperAdmin.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      })) ||
      (await Agent.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      }));

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.log("Error during password reset:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Both old and new passwords are required" });
  }

  try {
    let userToUpdate;

    if (user.role === "client") {
      userToUpdate = await Client.findById(user.id);
    } else if (user.role === "driver") {
      userToUpdate = await Driver.findById(user.id);
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    if (!userToUpdate) {
      return res.status(400).json({
        message: `${
          user.role.charAt(0).toUpperCase() + user.role.slice(1)
        } not found`,
      });
    }

    const isMatch = await comparePasswords(oldPassword, userToUpdate.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    userToUpdate.password = await hashPassword(newPassword, 10);

    await userToUpdate.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const clients = await Client.find({});
    const drivers = await Driver.find({});
    const restaurant = await Restaurant.find({});
    const admin = await Admin.find({});
    const allUsers = [...clients, ...drivers, ...restaurant, ...admin];

    return res.status(200).json({ users: allUsers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getAllClients = async (req, res) => {
  try {
    const { dataPerPage, page } = req.body;

    const limit = parseInt(dataPerPage, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    const totalClients = await Client.countDocuments();

    const totalPages = Math.ceil(totalClients / limit);

    const clients = await Client.find({})
      .skip((currentPage - 1) * limit)
      .limit(limit);

    const clientsWithRides = await Promise.all(
      clients.map(async (client) => {
        const rideCount = await Ride.countDocuments({ client: client._id });
        return { ...client._doc, rides: rideCount };
      })
    );

    return res.status(200).json({
      clients: clientsWithRides,
      total: totalPages,
      currentPage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const totalRides = await Ride.countDocuments({});
    const totalClients = await Client.countDocuments({});
    const totalDrivers = await Driver.countDocuments({});

    const placedRides = await Ride.countDocuments({ status: "placed" });
    const activeRides = await Ride.countDocuments({
      status: { $in: ["started", "placed", "accepted"] },
    });
    const cancelledRides = await Ride.countDocuments({ status: "cancelled" });
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Step 1: Get Total Earnings for the Day
    const rides = await Ride.aggregate([
      {
        $match: {
          status: "completed",
          dateAndTime: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalAmount = rides.length > 0 ? rides[0].totalAmount : 0;
    const adminCommission = (totalAmount * 5) / 100;

    // Step 2: Calculate Driver Payouts (25% per driver)
    const payouts = await Ride.aggregate([
      {
        $match: {
          status: "completed",
          dateAndTime: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: "$driver", // Group by driver
          totalEarnings: { $sum: "$amount" }, // Sum total amount earned by each driver
        },
      },
      {
        $project: {
          _id: 1,
          totalEarnings: 1,
          driverPayout: { $multiply: ["$totalEarnings", 0.25] }, // 25% payout
        },
      },
    ]);

    res.status(200).json({
      totalRides,
      totalClients,
      totalDrivers,
      placedRides,
      activeRides,
      cancelledRides,
      totalAmount,
      adminCommission,
      payouts,
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
