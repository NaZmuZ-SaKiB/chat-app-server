import express, { Application } from "express";
import cors from "cors";
import config from "./app/config";
import MainRouter from "./app/routes";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: config.front_end_url,
    credentials: true,
  })
);

// Application Routes
app.use("/api", MainRouter);

app.get("/", (req, res) => {
  res.send("Chat app!");
});

app.use(globalErrorHandler);

export default app;
