import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { errorMiddleware } from "./common/middleware/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./config/auth.js";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

// Better Auth must be registered before body parsers
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Current authenticated user (session-based, cookie auth)
const meHandler: express.RequestHandler = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.json({
      user: session.user,
      session: {
        id: session.session.id,
        expiresAt: session.session.expiresAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

app.get("/me", meHandler);
app.get("/api/me", meHandler);

// Logout endpoint – invalidates session and clears cookie
const logoutHandler: express.RequestHandler = async (req, res, next) => {
  try {
    const { headers } = await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
      returnHeaders: true,
    });

    const setCookie: string[] = [];
    headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        setCookie.push(value);
      }
    });

    if (setCookie.length > 0) {
      res.setHeader("set-cookie", setCookie);
    }

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};

app.post("/logout", logoutHandler);
app.post("/api/logout", logoutHandler);

// Swagger
const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
