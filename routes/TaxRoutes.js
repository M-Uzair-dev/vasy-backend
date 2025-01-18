import express from 'express';
import { createTax, deleteTax, getTaxes, updateTax } from '../controllers/Tax/TaxController.js';

const router = express.Router();

router.post('/', createTax);
router.get('/', getTaxes);
router.put('/', updateTax);
router.delete('/', deleteTax);

export default router;
