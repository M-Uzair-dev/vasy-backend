import mongoose from "mongoose";
import Order from "../../models/Order.js";
import Restaurant from "../../models/Restaurant.js";
import Rating from "../../models/Rating.js";
import Category from "../../models/Category.js";
import Dish from "../../models/Dish.js";

export const createRestaurant = async (req, res) => {
  try {
    const {
      fullName,
      address,
      phoneNumber,
      estimatedDeliveryTime,
      deliveryCost,
    } = req.body;
    const newRestaurant = new Restaurant({
      fullName,
      address,
      phoneNumber,
      estimatedDeliveryTime,
      deliveryCost,
    });
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant: savedRestaurant,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create restaurant", error: error.message });
  }
};
export const getRestaurants = async (req, res) => {
  try {
    const { id } = req.query;

    if (id) {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
        return res
          .status(404)
          .json({ message: `Restaurant with id ${id} not found` });
      }

      const orderStats = await Order.aggregate([
        {
          $match: { restaurantId: restaurant._id },
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            pendingOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
              },
            },
            activeOrders: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: ["$status", "confirmed"] },
                      { $eq: ["$status", "preparing"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            cancelledOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalOrders: 1,
            pendingOrders: 1,
            activeOrders: 1,
            cancelledOrders: 1,
          },
        },
      ]);

      const ratings = await Rating.find({
        ratingType: "Restaurant",
        entity: id,
      });

      return res.status(200).json({
        message: "Restaurant retrieved successfully",
        restaurant,
        ratings,
        orderStats,
      });
    }

    const restaurants = await Restaurant.find();

    const restaurantsWithRatings = await Promise.all(
      restaurants.map(async (restaurant) => {
        const ratings = await Rating.find({
          ratingType: "Restaurant",
          entity: restaurant._id,
        });
        return {
          ...restaurant.toObject(),
          ratings,
        };
      })
    );

    res.status(200).json({
      message: "Restaurants retrieved successfully",
      restaurants: restaurantsWithRatings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve restaurants",
      error: error.message,
    });
  }
};

export const getRestaurantsAndOrders = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("restaurantId");

    if (!restaurants || !orders) {
      return res.status(400).json({
        message: "No Restaurants or Orders found",
      });
    }

    res.status(200).json({
      message: "Restaurants and Orders retrieved successfully",
      restaurants,
      orders,
    });
  } catch (e) {
    res.status(500).json({
      message: "Failed to retrieve restaurants",
      error: e.message,
    });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.query;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedRestaurant) {
      return res
        .status(404)
        .json({ message: `Restaurant with id ${id} not found` });
    }
    res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update restaurant", error: error.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
    if (!deletedRestaurant) {
      return res
        .status(404)
        .json({ message: `Restaurant with id ${id} not found` });
    }
    res.status(200).json({
      message: "Restaurant deleted successfully",
      restaurant: deletedRestaurant,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete restaurant", error: error.message });
  }
};

export const getRestaurantsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const categories = await Category.find({ _id: categoryId });
    const restaurantIds = categories.map((category) => category.restaurantId);
    const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } });
    return restaurants;
  } catch (error) {
    console.error("Error fetching restaurants by category:", error);
    throw error;
  }
};

export const getDishesByRestaurantId = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const dishes = await Dish.aggregate([
      {
        $lookup: {
          from: "restaurantcategories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $match: {
          "category.restaurantId": new mongoose.Types.ObjectId(restaurantId),
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          image: 1,
          categoryName: "$category.name",
        },
      },
    ]);

    res.status(200).json(dishes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching dishes", error });
  }
};
