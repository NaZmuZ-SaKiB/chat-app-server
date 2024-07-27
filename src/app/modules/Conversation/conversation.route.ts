import { Router } from "express";
import auth from "../../middlewares/auth";
import { ConversationController } from "./conversation.controller";

const router = Router();

// GET
router.get("/:recipientId", auth, ConversationController.getConversationWith);

// POST
router.post(
  "/start/:recipientId",
  auth,
  ConversationController.startConversation
);

export const ConversationRouter = router;
