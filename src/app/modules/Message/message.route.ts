import { Router } from "express";
import auth from "../../middlewares/auth";
import { MessageController } from "./message.controller";

const router = Router();

// GET
router.get("/:conversationId", auth, MessageController.getMessages);

// POST
router.post("/:conversationId", auth, MessageController.sendMessage);

// PATCH
router.patch("/:id/seen", auth, MessageController.seenMessage);

export const MessageRouter = router;
