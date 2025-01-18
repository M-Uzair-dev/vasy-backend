import express from 'express';
import { createOrder, getUserOrders, updateOrderStatus, getOrderCountsByStatus } from '../controllers/Order/OrderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getUserOrders);
router.put('/', updateOrderStatus);
router.get('/status/:restaurantId', getOrderCountsByStatus);
export default router;
