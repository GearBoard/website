import { Router } from "express";
import { userRoute } from "./modules/user/user.route.js";
import { postRoute } from "./modules/post/post.route.js";

const router = Router();

router.use("/users", userRoute);
router.use("/posts", postRoute);

export default router;
