import express from "express";
import cors from "cors";
import morgan from "morgan";

import routes from "./app.routes.js";
import { errorHandler } from "./common/errors/error-handler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/health", (req, res) => res.send("OK"));
app.use("/api", routes); // API Routes
app.use(errorHandler); // Global Error Handler
app.use(morgan("dev"));

export default app;
