import Category from "../../models/Category.js";


export const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        return res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
export const getCategories = async (req, res) => {

    try {
        const { restaurantId, id } = req.query;

        if (id) {
            const category = await Category.findById(id).populate('restaurantId', 'name email');
            if (!category) return res.status(404).json({ message: 'Category not found' });
            return res.status(200).json({ message: 'Category fetched successfully', category });
        }

        if (restaurantId) {
            const categories = await Category.find({ restaurantId }).populate('restaurantId', 'name email');
            return res.status(200).json({ message: 'Categories fetched successfully', categories });
        }

        const allCategories = await Category.find().populate('restaurantId', 'name email');
        return res.status(200).json({ message: 'All categories fetched successfully', categories: allCategories });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.query.id, req.body, { new: true });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        return res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.query.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        return res.status(204).json({ message: 'Category deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
