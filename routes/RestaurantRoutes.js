import express from "express";
import {
  createRestaurant,
  deleteRestaurant,
  getDishesByRestaurantId,
  getRestaurants,
  getRestaurantsAndOrders,
  getRestaurantsByCategoryId,
  updateRestaurant,
} from "../controllers/Restaurant/RestaurantController.js";

const router = express.Router();

router.post("/", createRestaurant);
router.get("/", getRestaurants);
router.put("/", updateRestaurant);
router.delete("/", deleteRestaurant);
router.get("/restuarant-category/:categoryId", getRestaurantsByCategoryId);
router.get("/restuarant-dish/:restaurantId", getDishesByRestaurantId);
router.get("/orders", getRestaurantsAndOrders);

export default router;
