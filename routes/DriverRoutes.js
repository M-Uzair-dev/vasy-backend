import express from "express";
import {
  addDriver,
  editDriver,
  getDrivers,
  getSingleDriver,
} from "../controllers/Driver/DriverController.js";

const router = express.Router();
router.put("/", editDriver);
router.get("/", getDrivers);
router.get("/:id", getSingleDriver);

export default router;
