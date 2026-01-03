import express from "express";
import cors from "cors";

import routes from "./app.routes.js";
import { errorHandler } from "./common/errors/error-handler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/health", (req, res) => res.send("OK"));
app.use("/api", routes);
app.use(errorHandler);

export default app;
