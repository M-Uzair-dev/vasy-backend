import Service from "../../models/Service.js";


export const createService = async (req, res) => {
    try {
        const { title, kmChange, commissionType, peakSurcharge, weightLimit, tax, adminCommission, biddingSystem, image } = req.body;
        const service = new Service({ title, kmChange, commissionType, peakSurcharge, weightLimit, tax, adminCommission, biddingSystem, image });
        const savedService = await service.save();
        res.status(201).json({ message: 'Service created successfully', service: savedService });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create service', error: error.message });
    }
};

export const getServices = async (req, res) => {
    try {
        const { id } = req.query;

        if (id) {
            const service = await Service.findById(id);
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }
            return res.status(200).json({ message: 'Service retrieved successfully', service });
        } else {
            const services = await Service.find();
            return res.status(200).json({ message: 'Services retrieved successfully', services });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve services', error: error.message });
    }
};

export const updateService = async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.query.id, req.body, { new: true });
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service updated successfully', service: updatedService });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update service', error: error.message });
    }
};

export const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.query.id);
        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete service', error: error.message });
    }
};
