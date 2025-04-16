import mongoose from "mongoose";
import dotenv from "dotenv";
import { hashPassword } from "./utils/passwordUtils.js";
import Restaurant from "./models/Restaurant.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const createRestaurantUser = async () => {
  const email = "restaurant@example.com";
  const password = "restaurant123";
  const hashedPassword = await hashPassword(password);

  const restaurant = new Restaurant({
    email,
    password: hashedPassword,
    role: "restaurant",
    fullName: "Test Restaurant",
    address: "123 Test Street, Test City",
    phoneNumber: "1234567890",
    estimatedDeliveryTime: "30m",
    deliveryCost: 5.99,
  });

  try {
    await restaurant.save();
    console.log("\nCreated Restaurant User:");
    console.log("----------------");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("----------------");
  } catch (error) {
    if (error.code === 11000) {
      console.log("Restaurant user already exists");
    } else {
      console.error("Error creating restaurant user:", error);
    }
  }
};

// Run the script
connectDB().then(() => {
  createRestaurantUser().then(() => {
    mongoose.connection.close();
  });
});
