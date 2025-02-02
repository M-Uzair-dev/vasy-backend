import express from "express";
import {
  addDriver,
  deleteDriver,
  editDriver,
  getDrivers,
  getSingleDriver,
} from "../controllers/Driver/DriverController.js";

const router = express.Router();
router.put("/", editDriver);
router.get("/", getDrivers);
router.delete("/", deleteDriver);
router.get("/:id", getSingleDriver);

export default router;
