import { Router } from "express";
import { userRoute } from "./modules/user/user.route.js";
import { postRoute } from "./modules/post/post.route.js";
import { commentRoute } from "./modules/comment/comment.route.js";

const router = Router();

router.use("/users", userRoute);
router.use("/posts", postRoute);
router.use("/comments", commentRoute);

export default router;
