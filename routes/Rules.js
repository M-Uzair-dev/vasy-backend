import express from "express";
import {
  createRule,
  deleteRule,
  getRules,
  updateRule,
  getDeleted,
  restoreRule,
  deleteRulePermanently,
} from "../controllers/Rules/RuleController.js";

const router = express.Router();

router.post("/", createRule);
router.get("/", getRules);
router.put("/", updateRule);
router.delete("/", deleteRule);
router.delete("/permanent", deleteRulePermanently);
router.get("/deleted", getDeleted);
router.get("/restore", restoreRule);

export default router;
