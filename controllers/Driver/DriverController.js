import Driver from "../../models/Driver.js";

export const addDriver = async (req, res) => {
    try {
        const newDriver = new Driver(req.body);
        await newDriver.save();
        res.status(201).json(newDriver);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const editDriver = async (req, res) => {
    const { id } = req.query;
    try {
        const updatedDriver = await Driver.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDriver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json(updatedDriver);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getDrivers = async (req, res) => {
    const { id } = req.query;
    try {
        let drivers;

        if (id) {
            drivers = await Driver.findById(id);
            if (!drivers) {
                return res.status(404).json({ message: 'Driver not found' });
            }
        } else {
            drivers = await Driver.find();
        }

        res.status(200).json(drivers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

