import Payment from "../../models/Payment.js";
import Ride from "../../models/Ride.js";


export const createPayment = async (req, res) => {
    const { clientId, rideId, amount, paymentMethod, driverId } = req.body;

    try {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        if (ride.client.toString() !== clientId) {
            return res.status(403).json({ message: 'Client is not associated with this ride' });
        }
        const payment = new Payment({
            client: clientId,
            ride: rideId,
            amount,
            paymentMethod,
            paymentTo: driverId, // Payment is always to the driver
            status: 'pending'
        });
        await payment.save();
        res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updatePaymentStatus = async (req, res) => {
    const { paymentId, status } = req.body;

    try {
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        payment.status = status;
        payment.paidAt = status === 'completed' ? new Date() : null;

        await payment.save();

        res.status(200).json({ message: 'Payment status updated successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("client", "name email") // Populate client details
            .populate("ride", "pickupLocation dropoffLocation") // Populate ride details
            .populate("paymentTo", "name email"); // Populate recipient details

        res.status(200).json({ message: "Payments fetched successfully", payments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};