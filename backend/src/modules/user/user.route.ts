import { Router } from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../common/middleware/validate.middleware.js";
import { userController } from "./user.controller.js";
import { getUsersQuerySchema, getUserByIdSchema, updateUserSchema } from "./user.schema.js";

export const userRoute = Router();

// Apply auth middleware to all user routes
userRoute.use(authMiddleware);

userRoute.get(
  "/",
  validateQuery(getUsersQuerySchema),
  userController.findMany.bind(userController)
);

userRoute.get(
  "/:id",
  validateParams(getUserByIdSchema),
  userController.getById.bind(userController)
);

userRoute.patch(
  "/:id",
  validateParams(getUserByIdSchema),
  validateBody(updateUserSchema),
  userController.update.bind(userController)
);

userRoute.delete(
  "/:id",
  validateParams(getUserByIdSchema),
  userController.softDelete.bind(userController)
);
