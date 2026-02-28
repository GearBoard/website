import { Router } from "express";
import { userRoute } from "./modules/user/user.route.js";

const router = Router();

router.use("/users", userRoute);

export default router;
