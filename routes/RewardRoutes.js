import express from 'express';
import { createReward, getRewards, getRewardById, updateReward, deleteReward } from '../controllers/Reward/RewardController.js';

const router = express.Router();

router.post('/', createReward);
router.get('/', getRewards);
router.get('/:id', getRewardById);
router.put('/:id', updateReward);
router.delete('/:id', deleteReward);

export default router;
