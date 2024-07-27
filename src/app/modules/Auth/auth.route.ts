import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

// POST
router.post("/sign-up", AuthController.signUp);
router.post("/sign-in", AuthController.signIn);
router.post("/sign-out", AuthController.signOut);

export const AuthRouter = router;
