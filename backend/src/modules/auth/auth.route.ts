import { Router } from "express";
import { getMe, logout } from "./auth.controller.js";

const authRoute = Router();

authRoute.get("/me", getMe);
authRoute.post("/logout", logout);

export default authRoute;
