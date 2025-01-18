import Reward from "../../models/Reward.js";

export const createReward = async (req, res) => {
    try {
        const { title, description, value, client } = req.body;

        if (!title || !description || !value || !client) {
            return res.status(400).json({ message: 'All fields (title, description, value, client) are required' });
        }

        const reward = new Reward({ title, description, value, client });
        await reward.save();

        res.status(201).json({ message: 'Reward created successfully', reward });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create reward', error: error.message });
    }
};

export const getRewards = async (req, res) => {
    try {
        const rewards = await Reward.find().populate('client');
        res.status(200).json({ message: 'Rewards retrieved successfully', rewards });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve rewards', error: error.message });
    }
};

export const getRewardById = async (req, res) => {
    try {
        const { id } = req.params;
        const reward = await Reward.findById(id).populate('client');

        if (!reward) {
            return res.status(404).json({ message: `Reward with ID ${id} not found` });
        }

        res.status(200).json({ message: 'Reward retrieved successfully', reward });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve reward', error: error.message });
    }
};

export const updateReward = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, value, client } = req.body;

        const updatedReward = await Reward.findByIdAndUpdate(
            id,
            { title, description, value, client },
            { new: true, runValidators: true }
        );

        if (!updatedReward) {
            return res.status(404).json({ message: `Reward with ID ${id} not found` });
        }

        res.status(200).json({ message: 'Reward updated successfully', reward: updatedReward });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update reward', error: error.message });
    }
};

export const deleteReward = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedReward = await Reward.findByIdAndDelete(id);

        if (!deletedReward) {
            return res.status(404).json({ message: `Reward with ID ${id} not found` });
        }

        res.status(200).json({ message: 'Reward deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete reward', error: error.message });
    }
};
