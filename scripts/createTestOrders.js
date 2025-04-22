import mongoose from "mongoose";
import Order from "../models/Order.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  "mongodb+srv://asmamughal097:016wPL37Yoscp7Eb@cluster0.jlpafag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Fixed IDs for testing
const FIXED_IDS = {
  userId: "6711236ec462a032f2e6d424",
  restaurantId: "67126846db1a60e4bce62f88",
  cartId: "67126cd8527fe048fd8544c5",
  riderId: "6711236ec462a032f2e6d424", // Using same as userId for testing
};

const generateRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const generateDummyOrders = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing orders
    await Order.deleteMany({});
    console.log("Cleared existing orders");

    const orders = [];
    const now = new Date();

    // Generate orders for the last 6 months
    for (let i = 0; i < 6; i++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      // Generate 5-15 orders per month
      const ordersCount = Math.floor(Math.random() * 11) + 5;

      for (let j = 0; j < ordersCount; j++) {
        const orderDate = generateRandomDate(monthStart, monthEnd);
        const deliveryTime = new Date(orderDate);
        deliveryTime.setHours(deliveryTime.getHours() + 1); // 1 hour after order

        const order = new Order({
          userId: FIXED_IDS.userId,
          restaurantId: FIXED_IDS.restaurantId,
          cartId: FIXED_IDS.cartId,
          totalPrice: Math.floor(Math.random() * 1000) + 100, // Random price between 100-1100
          status: [
            "pending",
            "confirmed",
            "preparing",
            "delivered",
            "cancelled",
          ][Math.floor(Math.random() * 5)],
          paymentStatus: ["unpaid", "paid"][Math.floor(Math.random() * 2)],
          address: {
            street: "123 Test Street",
            city: "Test City",
            zipCode: "12345",
            country: "Test Country",
          },
          orderDate,
          createdAt: orderDate, // Set createdAt to match orderDate
          deliveryTime,
          riderId: FIXED_IDS.riderId,
          items: [
            {
              name: `Item ${j + 1}`,
              quantity: Math.floor(Math.random() * 5) + 1,
              price: Math.floor(Math.random() * 200) + 50,
            },
          ],
        });

        orders.push(order);
      }
    }

    // Insert all orders
    await Order.insertMany(orders);
    console.log(`Successfully created ${orders.length} dummy orders`);

    // Get the count of orders per month
    const monthlyCounts = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
    ]);

    console.log("\nOrders per month:");
    monthlyCounts.forEach(({ _id, count }) => {
      const monthName = new Date(_id.year, _id.month - 1).toLocaleString(
        "default",
        { month: "long" }
      );
      console.log(`${monthName} ${_id.year}: ${count} orders`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

generateDummyOrders();
