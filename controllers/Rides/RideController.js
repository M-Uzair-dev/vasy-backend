import Payment from "../../models/Payment.js";
import Rating from "../../models/Rating.js";
import Ride from "../../models/Ride.js";
import mongoose from 'mongoose';

export const createRide = async (req, res) => {
    try {
        const { driver, service, fareOffered, client, status, amount, dateAndTime, vehicleTypeId, distance, rideType } = req.body;
        if (!['food', 'package', 'travel'].includes(rideType)) {
            return res.status(400).json({ message: 'Invalid ride type. It must be one of: food, package, or travel.' });
        }

        const newRide = new Ride({ driver, service, fareOffered, client, status, amount, dateAndTime, vehicleTypeId, distance, rideType });
        const savedRide = await newRide.save();

        res.status(201).json({ message: 'Ride created successfully', ride: savedRide });
    } catch (error) {
        res.status(400).json({ message: 'Failed to create ride', error: error.message });
    }
};
export const getRides = async (req, res) => {
    try {
        const { id, status } = req.query;

        if (id) {
            const ride = await Ride.findById(id)
                .populate('driver')
                .populate('service')
                .populate('client')
                .populate('vehicleTypeId');

            if (!ride) {
                return res.status(404).json({ message: `Ride with id ${id} not found` });
            }

            const ratings = await Rating.find({
                ratingType: 'Ride',
                entity: id
            });

            const payments = await Payment.find({ ride: id }); // Fetch payments related to the ride
            const totalRides = await Ride.countDocuments({ driver: ride.driver._id });

            return res.status(200).json({
                message: 'Ride retrieved successfully',
                ride,
                ratings,
                payments,  // Include payments in the response
                totalRides
            });
        }

        let query = {};
        if (status) {
            query.status = status;
        }

        const rides = await Ride.find(query)
            .populate('driver')
            .populate('service')
            .populate('client')
            .populate('vehicleTypeId');

        if (!rides || rides.length === 0) {
            return res.status(404).json({ message: 'No rides found' });
        }

        const ridesWithRatingsAndPayments = await Promise.all(
            rides.map(async (ride) => {
                const ratings = await Rating.find({
                    ratingType: 'Ride',
                    entity: ride._id
                });

                const payments = await Payment.find({ ride: ride._id }); // Fetch payments related to each ride

                return {
                    ...ride.toObject(),
                    ratings,
                    payments // Include payments in the response
                };
            })
        );

        res.status(200).json({
            message: 'Rides retrieved successfully',
            rides: ridesWithRatingsAndPayments,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve rides', error: error.message });
    }
};

export const getRideOffers = async (req, res) => {
    const { clientId } = req.query;

    try {
        const rideOffers = await Ride.find({ client: clientId, status: 'placed' }).populate('driver service');
        res.status(200).json({ success: true, rideOffers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching ride offers' });
    }
};
export const updateRide = async (req, res) => {
    try {
        const updatedRide = await Ride.findByIdAndUpdate(req.query.id, req.body, { new: true });
        if (!updatedRide) {
            return res.status(404).json({ message: `Ride with id ${req.query.id} not found` });
        }
        res.status(200).json({ message: 'Ride updated successfully', ride: updatedRide });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update ride', error: error.message });
    }
};

export const deleteRide = async (req, res) => {
    try {
        const deletedRide = await Ride.findByIdAndDelete(req.query.id);
        if (!deletedRide) {
            return res.status(404).json({ message: `Ride with id ${req.query.id} not found` });
        }
        res.status(200).json({ message: 'Ride deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete ride', error: error.message });
    }
};
export const respondToRideOffer = async (req, res) => {
    const { rideId, action } = req.body;

    try {
        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride offer not found' });
        }

        if (action === 'accept') {
            ride.status = 'completed';
        } else if (action === 'reject') {
            ride.status = 'rejected';
        } else {
            return res.status(400).json({ success: false, message: 'Invalid action' });
        }

        await ride.save();
        res.status(200).json({ success: true, message: `Ride offer ${action}ed successfully`, ride });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error handling ride offer' });
    }
};

export const getDriverRideStats = async (req, res) => {
    const { driverId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(driverId)) {
            return res.status(400).json({ message: 'Invalid driver ID' });
        }

        const stats = await Ride.aggregate([
            { $match: { driver: new mongoose.Types.ObjectId(driverId), status: 'completed' } }, // Filter rides by driver and completed status
            {
                $group: {
                    _id: '$driver',
                    totalRides: { $sum: 1 }, // Count total rides
                    totalHours: {
                        $sum: {
                            $divide: [
                                { $subtract: ['$updatedAt', '$dateAndTime'] }, // Difference between end and start time in milliseconds
                                1000 * 60 // Convert milliseconds to minutes
                            ]
                        }
                    }
                }
            }
        ]);

        // Check if stats were found
        if (stats.length === 0) {
            return res.status(404).json({ message: 'No rides found for this driver' });
        }

        const { totalRides, totalHours } = stats[0];

        // Convert total hours to "XhYm" format
        const hours = Math.floor(totalHours / 60); // Convert minutes to hours
        const minutes = Math.round(totalHours % 60); // Get remaining minutes
        const totalTimeFormatted = `${hours}h${minutes}m`;

        res.json({
            message: 'Driver ride statistics retrieved successfully',
            totalRides,
            totalTime: totalTimeFormatted
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve driver ride statistics', error });
    }
};
export const getRidesByUser = async (req, res) => {
    try {
        const { driverId, clientId, status } = req.query;

        if (!driverId && !clientId) {
            return res.status(400).json({ message: 'Driver ID or Client ID is required' });
        }

        let query = {};
        if (driverId) {
            query.driver = driverId;
        } else if (clientId) {
            query.client = clientId;
        }

        if (status) {
            query.status = status;
        }

        const rides = await Ride.find(query)
            .populate('driver')
            .populate('service')
            .populate('client')
            .populate('vehicleTypeId');

        if (!rides || rides.length === 0) {
            return res.status(404).json({
                message: `No rides found for ${driverId ? `driver` : `client`} with ID ${driverId || clientId}`
            });
        }

        const ridesWithRatings = await Promise.all(
            rides.map(async (ride) => {
                const ratings = await Rating.find({
                    ratingType: 'Ride',
                    entity: ride._id
                });

                return {
                    ...ride.toObject(),
                    ratings
                };
            })
        );

        res.status(200).json({
            message: `Rides for ${driverId ? 'driver' : 'client'} retrieved successfully`,
            rides: ridesWithRatings
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve rides', error: error.message });
    }
};
export const getDailyTotalWithCommissionAndPayouts = async (req, res) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Step 1: Get Total Earnings for the Day
        const rides = await Ride.aggregate([
            {
                $match: {
                    status: "completed",
                    dateAndTime: { $gte: todayStart, $lte: todayEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const totalAmount = rides.length > 0 ? rides[0].totalAmount : 0;
        const adminCommission = (totalAmount * 5) / 100;

        // Step 2: Calculate Driver Payouts (25% per driver)
        const payouts = await Ride.aggregate([
            {
                $match: {
                    status: "completed",
                    dateAndTime: { $gte: todayStart, $lte: todayEnd }
                }
            },
            {
                $group: {
                    _id: "$driver", // Group by driver
                    totalEarnings: { $sum: "$amount" } // Sum total amount earned by each driver
                }
            },
            {
                $project: {
                    _id: 1,
                    totalEarnings: 1,
                    driverPayout: { $multiply: ["$totalEarnings", 0.25] } // 25% payout
                }
            }
        ]);

        res.status(200).json({
            message: "Daily total earnings with admin commission and driver payouts",
            totalAmount,
            adminCommission,
            payouts
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching daily earnings and payouts", error: error.message });
    }
};