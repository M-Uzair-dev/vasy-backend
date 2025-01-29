import express from "express";
import {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getOrderCountsByStatus,
  getAllOrders,
  getSingleOrder,
} from "../controllers/Order/OrderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getUserOrders);
router.put("/", updateOrderStatus);
router.get("/status/:restaurantId", getOrderCountsByStatus);
router.get("/all", getAllOrders);
router.get("/:orderId", getSingleOrder);
export default router;
