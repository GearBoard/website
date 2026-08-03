import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { AppVariables } from "../../common/types/index.js";
import { requireAuth } from "../../common/middleware/auth.middleware.js";
import { successResponse } from "../../common/utils/response.js";
import { validationHook } from "../../common/utils/validation-hook.js";
import { UploadImageBodyInputDTO } from "./dto/index.js";
import { uploadImageService } from "./service/index.js";

export const uploadRoute = new Hono<{ Variables: AppVariables }>().post(
  "/image",
  requireAuth,
  zValidator("form", UploadImageBodyInputDTO, validationHook),
  async (c) => {
    const data = c.req.valid("form");
    const result = await uploadImageService(data.file);
    return c.json(successResponse(result, "Image uploaded successfully"), 201);
  }
);
