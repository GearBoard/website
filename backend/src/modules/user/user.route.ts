import { Router } from "express";
import { validateBody, validateParams } from "../../common/middleware/validate.middleware.js";
import { userController } from "./user.controller.js";
import { createUserSchema, getUserByIdSchema } from "./user.schema.js";

export const userRoute = Router();

userRoute.get(
  "/:id",
  validateParams(getUserByIdSchema),
  userController.getById.bind(userController)
);

userRoute.get(
  "/:id",
  validateParams(getUserByIdSchema),
  userController.getById.bind(userController)
);
userRoute.post("/", validateBody(createUserSchema), userController.create.bind(userController));
