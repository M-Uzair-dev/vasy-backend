import Dish from "../../models/Dish.js";

export const createDish = async (req, res) => {
    try {
        const dish = new Dish(req.body);
        await dish.save();
        return res.status(201).json({ message: 'Dish created successfully', dish });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const getDishes = async (req, res) => {
    try {
        const { categoryId } = req.query;

        if (categoryId) {
            const dishes = await Dish.find({ categoryId }).populate('categoryId', 'name');
            return res.status(200).json({ message: 'Dishes fetched successfully', dishes });
        }

        const dishes = await Dish.find().populate('categoryId', 'name');
        return res.status(200).json({ message: 'All dishes fetched successfully', dishes });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};


export const updateDish = async (req, res) => {
    try {
        const dish = await Dish.findByIdAndUpdate(req.query.id, req.body, { new: true });
        if (!dish) return res.status(404).json({ message: 'Dish not found' });
        return res.status(200).json({ message: 'Dish updated successfully', dish });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteDish = async (req, res) => {
    try {
        const dish = await Dish.findByIdAndDelete(req.query.id);
        if (!dish) return res.status(404).json({ message: 'Dish not found' });
        return res.status(204).json({ message: 'Dish deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
