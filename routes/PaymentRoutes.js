import express from 'express';
import { createPayment, updatePaymentStatus } from '../controllers/Payment/PaymentController.js';

const router = express.Router();

router.post('/', createPayment);
router.put('/', updatePaymentStatus);

export default router;
