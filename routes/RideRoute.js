import express from 'express';
import { createRide, deleteRide, getRideOffers, getRides, respondToRideOffer, updateRide, getDriverRideStats, getRidesByUser, getDailyTotalAmount, getDailyTotalWithCommissionAndPayouts } from '../controllers/Rides/RideController.js';

const router = express.Router();

router.post('/', createRide);
router.get('/', getRides);
router.put('/', updateRide);
router.delete('/', deleteRide);
router.get('/offers', getRideOffers);
router.post('/respond', respondToRideOffer);
router.get('/stats/:driverId', getDriverRideStats);
router.get('/user-rides', getRidesByUser);
router.get('/commission', getDailyTotalWithCommissionAndPayouts);
export default router;
