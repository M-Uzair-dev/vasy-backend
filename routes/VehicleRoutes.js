import express from 'express';
import { createVehicle, deleteVehicle, getVehicles, updateVehicle } from '../controllers/Vehicle/VehicleController.js';

const router = express.Router();

router.get('/', getVehicles);
router.post('/', createVehicle);
router.put('/', updateVehicle);
router.delete('/', deleteVehicle);

export default router;
