
import express from 'express';
import { addDriver, editDriver, getDrivers } from '../controllers/Driver/DriverController.js';

const router = express.Router();
router.put('/', editDriver);
router.get('/', getDrivers);

export default router;
