import { Tax } from "../../models/Tax.js";


export const createTax = async (req, res) => {
    const { location, amount, admin, userId } = req.body;
    try {
        const tax = new Tax({ location, amount, admin, userId });
        await tax.save();
        res.status(201).json(tax);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTaxes = async (req, res) => {
    const { id } = req.query;

    try {
        if (id) {
            const tax = await Tax.findById(id).populate('admin');
            if (!tax) return res.status(404).json({ message: 'Tax not found' });
            return res.status(200).json(tax);
        }

        const taxes = await Tax.find().populate('admin');
        res.status(200).json(taxes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const updateTax = async (req, res) => {
    const { location, amount, admin } = req.body;
    try {
        const tax = await Tax.findByIdAndUpdate(req.query.id, { location, amount, admin }, { new: true });
        if (!tax) return res.status(404).json({ message: 'Tax not found' });
        res.status(200).json(tax);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTax = async (req, res) => {
    try {
        const tax = await Tax.findByIdAndDelete(req.params.id);
        if (!tax) return res.status(404).json({ message: 'Tax not found' });
        res.status(200).json({ message: 'Tax deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
