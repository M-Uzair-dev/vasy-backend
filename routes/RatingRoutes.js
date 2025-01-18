
import express from 'express';
import { getAllRatings, getRatings, submitRating } from '../controllers/Ratings/RatingController.js';
const router = express.Router();

router.post('/', submitRating);
router.get('/', getRatings);
router.get('/all', getAllRatings);
export default router;
