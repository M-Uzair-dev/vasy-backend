import Cart from "../../models/Cart.js";
import Order from "../../models/Order.js";
import Category from "../../models/Category.js";
import mongoose from "mongoose";
export const createOrder = async (req, res) => {
  try {
    const { userId, address, deliveryTime } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const newOrder = new Order({
      userId,
      restaurantId: cart.restaurantId,
      cartId: cart._id,
      totalPrice: cart.totalPrice,
      address,
      deliveryTime,
      riderId: req.body.riderId,
    });

    await newOrder.save();
    //await Cart.findByIdAndDelete(cart._id);
    res.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating order" });
  }
};
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const orders = await Order.find({ userId }).populate("cartId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving orders" });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.query;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Error updating order status" });
  }
};
export const getOrderCountsByStatus = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required" });
    }

    const orderCounts = await Order.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      delivered: 0,
      cancelled: 0,
    };

    orderCounts.forEach((order) => {
      statusCounts[order._id] = order.count;
    });

    return res.status(200).json(statusCounts);
  } catch (error) {
    console.error("Error fetching order counts by status:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("restaurantId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving orders" });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("riderId")
      .populate("cartId");

    const categoryId = order?.cartId?.items[0].categoryId;
    let address;
    if (categoryId) {
      const category = await Category.findById(categoryId).populate(
        "restaurantId"
      );
      address = category?.restaurantId?.address;
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ order, address });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving order" });
  }
};
export const getOrdersReport = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("restaurantId");

    // Get current date
    const currentDate = new Date();

    // Create an array of the last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      return {
        month: date.toLocaleString("default", { month: "long" }),
        year: date.getFullYear(),
        startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      };
    }).reverse();

    // Count orders for each month
    const monthlyCounts = months.map(({ month, year, startDate, endDate }) => {
      const count = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      }).length;

      return {
        [`${month} ${year}`]: count,
      };
    });

    const result = Object.assign({}, ...monthlyCounts);

    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error retrieving orders" });
  }
};
