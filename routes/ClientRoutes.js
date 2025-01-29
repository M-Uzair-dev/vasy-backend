import express from "express";
import {
  addClient,
  getProfile,
  deleteClient,
  editClient,
  getAllClients,
  getClient,
} from "../controllers/Client/ClientController.js";

const router = express.Router();

router.put("/", editClient);
router.get("/single", getClient);
router.get("/profile", getProfile);
router.get("/", getAllClients);
router.delete("/:id", deleteClient);

export default router;
