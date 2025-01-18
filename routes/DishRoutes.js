import express from 'express';
import { createDish, deleteDish, getDishes, updateDish } from '../controllers/Dishes/DishController.js';


const router = express.Router();

router.post('/', createDish);
router.get('/', getDishes);
router.put('/', updateDish);
router.delete('/', deleteDish);

export default router;
