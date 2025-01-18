import express from 'express';
import { createNotification, deleteNotification, getAllNotifications, getUserNotifications, markAsRead } from '../controllers/Notifications/NotificationController.js';

const router = express.Router();
router.get('/all', getAllNotifications);
router.post('/', createNotification);
router.get('/:userId', getUserNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);
export default router;
