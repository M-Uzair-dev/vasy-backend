import express from 'express';
import { addFunds, createWallet, getWallet, transferFunds } from '../controllers/Wallet/WalletController.js';

const router = express.Router();

router.post('/', createWallet);
router.post('/addFunds', addFunds);
router.post('/transferFunds', transferFunds);
router.get('/', getWallet);

export default router;
