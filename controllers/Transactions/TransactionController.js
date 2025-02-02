import Transaction from "../../models/Transactions.js";
import Wallet from "../../models/Wallet.js";

export const createTransaction = async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    const wallet = await Wallet.findOne({ userId: newTransaction.client });

    if (wallet) {
      wallet.totalBalance += newTransaction.amount;
      await wallet.save();
    }
    console.log(wallet);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const clientID = req.query.id;
    const transactions = await Transaction.find({ client: clientID });
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
