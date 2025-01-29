import Transaction from "../../models/Transactions.js";

export const createTransaction = async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
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
