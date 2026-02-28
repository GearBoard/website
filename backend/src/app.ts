import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { errorMiddleware } from "./common/middleware/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Swagger
const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
