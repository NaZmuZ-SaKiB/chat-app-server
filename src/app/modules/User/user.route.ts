import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";

const router = Router();

// GET
router.get("/", auth, UserController.searchUsers);
router.get("/sidebar", auth, UserController.getSidebarConversations);
router.get(
  "/conversation/:conversationId",
  auth,
  UserController.getUserByConversationId
);
router.get("/:id", auth, UserController.getUserById);

// PATCH
router.patch("/", auth, UserController.update);

export const UserRouter = router;
