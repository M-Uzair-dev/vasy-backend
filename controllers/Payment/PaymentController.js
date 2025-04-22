import Payment from "../../models/Payment.js";
import Ride from "../../models/Ride.js";
import Bank from "../../models/Bank.js";
import Wallet from "../../models/Wallet.js";

export const createPayment = async (req, res) => {
  const { clientId, rideId, amount, paymentMethod, driverId } = req.body;

  try {
    if (rideId) {
      const ride = await Ride.findById(rideId);
      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }
      if (ride.client.toString() !== clientId) {
        return res
          .status(403)
          .json({ message: "Client is not associated with this ride" });
      }
    }

    const wallet = await Wallet.findOne({ userId: clientId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    if (wallet.totalBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    const bank = await Bank.findOne({ userId: clientId });
    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    const payment = new Payment({
      client: clientId,
      ride: rideId,
      amount,
      paymentMethod,
      paymentTo: driverId, // Payment is always to the driver
      status: "pending",
    });
    wallet.totalBalance -= amount;
    await wallet.save();
    await payment.save();
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  const { paymentId, status } = req.body;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    payment.status = status;
    payment.paidAt = status === "completed" ? new Date() : null;

    await payment.save();

    res
      .status(200)
      .json({ message: "Payment status updated successfully", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllPayments = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    let payments;
    if (restaurantId) {
      payments = await Payment.find({ client: restaurantId })
        .populate({
          path: "client",
          model: "BaseUser",
          select: "firstName lastName email",
        })
        .populate("ride", "pickupLocation dropoffLocation")
        .populate("paymentTo", "name email");
    } else {
      payments = await Payment.find()
        .populate({
          path: "client",
          model: "BaseUser",
          select: "firstName lastName email fullName",
        })
        .populate("ride", "pickupLocation dropoffLocation")
        .populate("paymentTo", "name email");
    }
    console.log(payments);
    const updatedPayments = await Promise.all(
      payments.map(async (payment) => {
        if (payment.client) {
          const bank = await Bank.findOne({ userId: payment.client._id });
          const clientData = payment.client.toObject
            ? payment.client.toObject()
            : payment.client;
          return {
            ...payment.toObject(),
            client: {
              ...clientData,
              bank,
            },
          };
        }
        return payment.toObject();
      })
    );

    res.status(200).json({
      message: "Payments fetched successfully",
      payments: updatedPayments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
