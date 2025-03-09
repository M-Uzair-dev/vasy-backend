import express from "express";
import {
  createZone,
  createZones,
  deleteZone,
  getZones,
  updateZone,
} from "../controllers/Zones/ZoneController.js";

const router = express.Router();

router.post("/", createZone);
router.post("/all", createZones);
router.get("/", getZones);
router.put("/", updateZone);
router.delete("/", deleteZone);

export default router;
