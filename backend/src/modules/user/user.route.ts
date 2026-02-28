import { Router } from "express";
import { userController } from "./user.controller.js";

export const userRoute = Router();

userRoute.get("/:id", userController.getById.bind(userController));
userRoute.post("/", userController.create.bind(userController));
