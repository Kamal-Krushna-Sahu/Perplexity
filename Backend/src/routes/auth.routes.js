import { Router } from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";
import {
  login,
  register,
  verifyEmail,
} from "../controllers/auth.controller.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Login User and return JWT Token
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login", loginValidator, login);

/**
 * @route GET /api/auth/verify-email
 * @desc verify user Email
 * @access Public
 * @query {token}
 */
authRouter.get("/verify-email", verifyEmail);

export default authRouter;
