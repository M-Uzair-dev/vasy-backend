import Vehicle from "../../models/Vehicle.js";

export const createVehicle = async (req, res) => {
  const { name, status, driver } = req.body;
  try {
    const vehicle = new Vehicle({ name, status, driver });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const { id } = req.query;
    let vehicles;

    if (id) {
      vehicles = await Vehicle.findById(id);
      if (!vehicles) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
    } else {
      vehicles = await Vehicle.find();
    }

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.query.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
