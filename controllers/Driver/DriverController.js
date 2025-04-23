import Driver from "../../models/Driver.js";
import Vehicle from "../../models/Vehicle.js";
import Ride from "../../models/Ride.js";
import Bank from "../../models/Bank.js";
import Transaction from "../../models/Transactions.js";
import Payment from "../../models/Payment.js";
import Rating from "../../models/Rating.js";
import Wallet from "../../models/Wallet.js";
export const addDriver = async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    await newDriver.save();
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editDriver = async (req, res) => {
  const { id } = req.query;
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDrivers = async (req, res) => {
  const { id, pending, approved, page, data } = req.query;
  const limit = parseInt(data, 10) || 10;
  const currentPage = parseInt(page, 10) || 1;
  let total;
  try {
    let drivers;

    if (id) {
      drivers = await Driver.findById(id).sort({ createdAt: -1 });
      if (!drivers) {
        return res.status(404).json({ message: "Driver not found" });
      }
    } else {
      if (pending) {
        const totalDrivers = await Driver.countDocuments({
          status: "pending",
        }).sort({ createdAt: -1 });
        total = Math.ceil(totalDrivers / limit);
        drivers = await Driver.find({ status: "pending" })
          .skip((currentPage - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 });
      } else if (approved) {
        const totalDrivers = await Driver.countDocuments({
          status: "approved",
        }).sort({ createdAt: -1 });
        total = Math.ceil(totalDrivers / limit);
        drivers = await Driver.find({ status: "approved" })
          .skip((currentPage - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 });
      } else {
        const totalDrivers = await Driver.countDocuments().sort({
          createdAt: -1,
        });
        total = Math.ceil(totalDrivers / limit);
        drivers = await Driver.find()
          .skip((currentPage - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 });
      }
    }

    const driversWithVehiclesAndRides = await Promise.all(
      drivers.map(async (driver) => {
        const vehicle = await Vehicle.findOne({ driver: driver._id });
        const rideCount = await Ride.countDocuments({ driver: driver._id });

        const driverData = driver.toObject();
        if (vehicle) {
          driverData.vehicle = vehicle;
        }
        driverData.rides = rideCount;

        return driverData;
      })
    );

    res.status(200).json({ drivers: driversWithVehiclesAndRides, total });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const getSingleDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findById(id);
    const bank = await Bank.findOne({ userId: driver._id });
    const transactions = await Transaction.find({ client: driver._id });

    const rides = await Ride.find({ driver: driver._id })
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

    const payout = await Payment.find({ paymentTo: driver._id });

    const query = {
      ratingType: "Driver",
      entity: driver._id,
    };
    const ratings = await Rating.find(query).populate({
      path: "entity",
      select: "name",
      model: "Driver",
    });

    const avgRating =
      ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

    const wallet = await Wallet.findOne({ userId: driver._id });
    let balance = 0;
    if (wallet) {
      balance = wallet.totalBalance;
    }
    return res.status(200).json({
      driver,
      bank,
      transactions,
      rides: rideDetails,
      payout,
      avgRating,
      balance,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};

export const deleteDriver = async (req, res) => {
  const { id } = req.query;
  try {
    const deletedDriver = await Driver.findByIdAndDelete(id);
    if (!deletedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
