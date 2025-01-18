import { Zone } from "../../models/Zone.js";


export const createZone = async (req, res) => {
    const { location, availability, admin } = req.body;
    try {
        const zone = new Zone({ location, availability, admin });
        await zone.save();
        res.status(201).json(zone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getZones = async (req, res) => {
    const { id } = req.query;
    try {
        if (id) {
            const zone = await Zone.findById(id).populate('admin');
            if (!zone) return res.status(404).json({ message: 'Zone not found' });
            return res.status(200).json(zone);
        }
        const zones = await Zone.find().populate('admin');
        res.status(200).json(zones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateZone = async (req, res) => {
    const { location, availability, admin } = req.body;
    try {
        const zone = await Zone.findByIdAndUpdate(req.query.id, { location, availability, admin }, { new: true });
        if (!zone) return res.status(404).json({ message: 'Zone not found' });
        res.status(200).json(zone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteZone = async (req, res) => {
    try {
        const zone = await Zone.findByIdAndDelete(req.query.id);
        if (!zone) return res.status(404).json({ message: 'Zone not found' });
        res.status(200).json({ message: 'Zone deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
