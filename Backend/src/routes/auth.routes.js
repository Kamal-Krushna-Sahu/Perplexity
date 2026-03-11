import { Router } from "express";
import { registerValidator } from "../validators/auth.validator.js";
import { registerUser } from "../controllers/auth.controller.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidator, registerUser);

export default authRouter;
