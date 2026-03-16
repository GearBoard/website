import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { toNodeHandler } from "better-auth/node";

import routes from "./routes.js";
import { auth } from "./config/auth.js";
import { env } from "./config/env.js";
import { errorMiddleware } from "./common/middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: env.BETTER_AUTH_TRUSTED_ORIGIN,
    credentials: true,
  })
);

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
