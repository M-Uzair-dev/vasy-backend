import express from 'express';
import { addToCart, getUserCart, removeFromCart } from '../controllers/Cart/CartController.js';

const router = express.Router();

router.post('/', addToCart);
router.get('/', getUserCart);
router.put('/', removeFromCart);

export default router;
