import express from 'express';
import { createService, deleteService, getServices, updateService } from '../controllers/Service/ServiceController.js';

const router = express.Router();

router.post('/', createService);
router.get('/', getServices);
router.put('/', updateService);
router.delete('/', deleteService);

export default router;
