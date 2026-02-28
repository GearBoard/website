import { Router } from "express";
import { authController } from "./auth.controller.js";

export const authRoute = Router();

authRoute.post("/login", authController.login.bind(authController));
authRoute.post("/register", authController.register.bind(authController));
