import { Router } from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = Router();

// GET
router.get("/me", auth, AuthController.getMe);

// POST
router.post("/sign-up", AuthController.signUp);
router.post("/sign-in", AuthController.signIn);

// PATCH
router.patch("/change-password", auth, AuthController.changePassword);

export const AuthRouter = router;
