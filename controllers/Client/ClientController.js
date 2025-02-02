import Client from "../../models/Client.js";
import Ride from "../../models/Ride.js";
import Payment from "../../models/Payment.js";
import Transaction from "../../models/Transactions.js";
import Wallet from "../../models/Wallet.js";
export const addClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json({ message: "Client successfully added", client });
  } catch (error) {
    res.status(400).json({ message: `Error adding client: ${error.message}` });
  }
};

export const editClient = async (req, res) => {
  try {
    const { id } = req.query;
    const client = await Client.findByIdAndUpdate(id, req.body, { new: true });
    if (!client) return res.status(404).json({ message: "Client not found" });

    res.json({ message: "Client successfully updated", client });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Error updating client: ${error.message}` });
  }
};

export const getClient = async (req, res) => {
  try {
    const { id } = req.query;
    const client = await Client.findById(id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getProfile = async (req, res) => {
  try {
    const { id } = req.query;

    // Fetch the client
    let client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Fetch the rides for the client
    const rides = await Ride.find({ client: client._id })
      .select("_id driver service createdAt status")
      .populate("service")
      .populate("driver");

    // Fetch payments corresponding to the rides
    const rideIds = rides.map((ride) => ride._id);
    const payments = await Payment.find({ ride: { $in: rideIds } }).select(
      "ride paymentMethod status amount"
    );

    // Combine ride and payment data
    const rideDetails = rides.map((ride) => {
      const payment = payments.find(
        (payment) => payment.ride.toString() === ride._id.toString()
      );

      return {
        ...ride.toObject(),
        payment: payment
          ? {
              paymentMethod: payment.paymentMethod,
              status: payment.status,
              amount: payment.amount,
            }
          : null, // If no payment found
      };
    });
    const transactions = await Transaction.find({ client: client._id });

    const wallet = await Wallet.findOne({ userId: client._id });
    let balance;
    if (!wallet) {
      balance = 0;
    } else {
      balance = wallet.totalBalance;
    }
    client.balance = balance;
    res.json({ client, rideDetails, transactions, balance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndDelete(id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
