import { Router } from "express";
import { userRoute } from "./modules/user/user.route.js";
import { commentRoute } from "./modules/comment/comment.route.js";

const router = Router();

router.use("/users", userRoute);
router.use("/comments", commentRoute);

export default router;
