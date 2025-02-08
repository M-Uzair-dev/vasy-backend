import express from "express";
import {
  createRule,
  deleteRule,
  getRules,
  updateRule,
} from "../controllers/Rules/RuleController.js";

const router = express.Router();

router.post("/", createRule);
router.get("/", getRules);
router.put("/", updateRule);
router.delete("/", deleteRule);

export default router;
