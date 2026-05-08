import { Router } from "express";
import { requireAuth, requireAdmin } from "../../common/middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../common/middleware/validate.middleware.js";
import { userController } from "./user.controller.js";
import {
  createUserSchema,
  getAllUsersQuerySchema,
  getUserByIdSchema,
  updateUserSchema,
} from "./user.schema.js";

export const userRoute = Router();

// GET /users/me — authenticated user's own profile
userRoute.get("/me", requireAuth, userController.getMe.bind(userController));

// GET /users — admin only, paginated list with filters
userRoute.get(
  "/",
  requireAuth,
  requireAdmin,
  validateQuery(getAllUsersQuerySchema),
  userController.getAll.bind(userController)
);

// GET /users/:id — owner or admin
userRoute.get(
  "/:id",
  requireAuth,
  validateParams(getUserByIdSchema),
  userController.getById.bind(userController)
);

// POST /users — admin only
userRoute.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(createUserSchema),
  userController.create.bind(userController)
);

// PATCH /users/:id — owner or admin
userRoute.patch(
  "/:id",
  requireAuth,
  validateParams(getUserByIdSchema),
  validateBody(updateUserSchema),
  userController.update.bind(userController)
);

// DELETE /users/:id — owner or admin, soft delete
userRoute.delete(
  "/:id",
  requireAuth,
  validateParams(getUserByIdSchema),
  userController.delete.bind(userController)
);
