import Driver from "../../models/Driver.js";
import Vehicle from "../../models/Vehicle.js";
import Ride from "../../models/Ride.js";
import Bank from "../../models/Bank.js";
import Transaction from "../../models/Transactions.js";
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
      drivers = await Driver.findById(id);
      if (!drivers) {
        return res.status(404).json({ message: "Driver not found" });
      }
    } else {
      if (pending) {
        const totalDrivers = await Driver.countDocuments({ status: "pending" });
        total = Math.ceil(totalDrivers / limit);
        drivers = await Driver.find({ status: "pending" })
          .skip((currentPage - 1) * limit)
          .limit(limit);
      } else if (approved) {
        const totalDrivers = await Driver.countDocuments({
          status: "approved",
        });
        total = Math.ceil(totalDrivers / limit);
        drivers = await Driver.find({ status: "approved" })
          .skip((currentPage - 1) * limit)
          .limit(limit);
      } else {
        const totalDrivers = await Driver.countDocuments();
        total = Math.ceil(totalDrivers / limit);
        drivers = await Driver.find()
          .skip((currentPage - 1) * limit)
          .limit(limit);
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

export const getSingleDriver = async () => {
  try {
    const { id } = req.params;
    const driver = await Driver.findById(id);
    const bank = await Bank.findOne({ userId: driver._id });
    const transactions = await Transaction.find({ client: driver._id });
    const rides = await Ride.find({ driver: driver._id });

    return res.status(200).json({ driver, bank, transactions, rides });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};
