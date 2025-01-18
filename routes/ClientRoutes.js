import express from 'express';
import { addClient, deleteClient, editClient, getAllClients, getClient } from '../controllers/Client/ClientController.js';

const router = express.Router();

router.put('/', editClient);
router.get('/single', getClient);
router.get('/', getAllClients);
router.delete('/:id', deleteClient);

export default router;
