import express from 'express';
import { createBank, deleteBank, getBanks, updateBank } from '../controllers/Bank/BankController.js';

const router = express.Router();

router.get('/', getBanks);
router.post('/', createBank);
router.put('/', updateBank);
router.delete('/', deleteBank);

export default router;
