import express from 'express';
import { createPayment, getAllPayments, updatePaymentStatus } from '../controllers/Payment/PaymentController.js';

const router = express.Router();

router.post('/', createPayment);
router.put('/', updatePaymentStatus);
router.get('/', getAllPayments);
export default router;
