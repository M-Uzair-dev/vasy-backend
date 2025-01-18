import Driver from "../../models/Driver.js";
import Rating from "../../models/Rating.js";
import Ride from "../../models/Ride.js";
import mongoose from 'mongoose'
import Restaurant from '../../models/Restaurant.js';
export const submitRating = async (req, res) => {
    const { entityId, userId, ratingType, rating, feedback } = req.body;

    try {
        if (!['Driver', 'Restaurant', 'Ride'].includes(ratingType)) {
            return res.status(400).json({ message: 'Invalid rating type' });
        }
        let entity;
        if (ratingType === 'Ride') {
            entity = await Ride.findById(entityId);

            if (entity?.status !== 'completed') {
                return res.status(400).json({ message: 'Only completed rides can be rated' });
            }
        } else if (ratingType === 'Driver') {
            entity = await Driver.findById(entityId);
        } else if (ratingType === 'Restaurant') {
            entity = await Restaurant.findById(entityId);
        }

        if (!entity) {
            return res.status(404).json({ message: `${ratingType} not found` });
        }
        const newRating = new Rating({
            entity: entityId,
            ratingType,
            user: userId,
            rating,
            feedback
        });
        await newRating.save();

        res.status(201).json({ message: 'Rating submitted successfully', rating: newRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting rating', error: error.message });
    }
};
export const getRatings = async (req, res) => {
    const { entityId, ratingType } = req.query;
    try {
        if (!['Driver', 'Restaurant', 'Ride'].includes(ratingType)) {
            return res.status(400).json({ message: 'Invalid rating type' });
        }
        const query = {};
        if (entityId) {
            query.entity = entityId;
        }
        if (ratingType) {
            query.ratingType = ratingType;
        }
        const ratings = await Rating.find(query)
            .populate({
                path: 'entity',
                select: 'name',
                model: ratingType
            });

        if (ratings.length === 0) {
            return res.status(404).json({ message: 'No ratings found for the specified criteria' });
        }
        const avgRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

        res.json({
            averageRating: avgRating.toFixed(2),
            totalRatings: ratings.length,
            ratings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving ratings', error: error.message });
    }
};
export const getAllRatings = async (req, res) => {
    try {
        const { id } = req.query;
        console.log(id)
        if (id) {
            const rating = await Rating.findById(id).populate('entity user');
            if (!rating) {
                return res.status(404).json({ message: 'Rating not found' });
            }
            return res.status(200).json(rating);
        }

        const ratings = await Rating.find().populate('entity user');
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
