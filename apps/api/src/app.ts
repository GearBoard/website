import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import { auth } from "./config/auth.js";
import { env } from "./config/env.js";
import { resolveHttpError } from "./common/utils/http-error.js";
import { apiRoutes } from "./routes.js";

const app = new Hono();

app.use(cors({ origin: env.BETTER_AUTH_TRUSTED_ORIGIN, credentials: true }));
app.use("/uploads/*", serveStatic({ root: "./" }));
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
app.get("/", (c) => c.text("Hello World!"));
app.route("/", apiRoutes);

app.onError((err, c) => {
  const { statusCode, message } = resolveHttpError(err);
  return c.json({ success: false, message }, statusCode as Parameters<typeof c.json>[1]);
});

export default app;
