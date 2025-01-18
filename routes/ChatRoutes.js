import express from "express";
import { createMessage, getMessages } from "../controllers/Chat/MessageController.js";
import { createConversation, getConversations } from "../controllers/Chat/ConversationController.js";

const router = express.Router();
router.post("/conversation", createConversation)
router.get("/conversation/:userId", getConversations)
router.post("/message", createMessage);
router.get("/message/:conversationId", getMessages);

export default router;
