import express from "express";
import {
  createDish,
  deleteDish,
  getDishes,
  updateDish,
} from "../controllers/Dishes/DishController.js";
import { getSingleDriver } from "../controllers/Driver/DriverController.js";

const router = express.Router();

router.post("/", createDish);
router.get("/", getDishes);
router.put("/", updateDish);
router.delete("/", deleteDish);
router.get("/:id", getSingleDriver);

export default router;
