import Bank from "../../models/Bank.js";
import { Tax } from "../../models/Tax.js";
import Wallet from "../../models/Wallet.js";


export const createWallet = async (req, res) => {
    try {
        const { userId, totalBalance, taxId, bankId } = req.body;

        if (!userId || !totalBalance) {
            return res.status(400).json({ message: 'User ID and Total Balance are required' });
        }

        const tax = taxId ? await Tax.findById(taxId) : null;
        const bank = bankId ? await Bank.findById(bankId) : null;

        if (taxId && !tax) {
            return res.status(404).json({ message: 'Tax record not found' });
        }

        if (bankId && !bank) {
            return res.status(404).json({ message: 'Bank record not found' });
        }

        const wallet = new Wallet({
            userId,
            totalBalance,
            taxId: tax ? tax._id : null,
            bankId: bank ? bank._id : null
        });

        await wallet.save();

        res.status(201).json({
            message: 'Wallet created successfully',
            wallet,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create wallet', error: error.message });
    }
};
export const addFunds = async (req, res) => {
    const { amount, userId } = req.body;
    const wallet = await Wallet.findOne({ userId });
    wallet.totalBalance += amount;
    await wallet.save();
    res.json(wallet);
};

export const transferFunds = async (req, res) => {
    const { amount, userId } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
        return res.status(400).json({ message: 'Wallet not found for the user' });
    }

    if (wallet.totalBalance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    wallet.totalBalance -= amount;
    await wallet.save();

    res.json(wallet);
};

export const getWallet = async (req, res) => {
    const { userId } = req.query;
    const wallet = await Wallet.findOne({ userId });
    res.json(wallet);
};
