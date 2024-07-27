import express, { Application } from "express";
import cors from "cors";
import config from "./app/config";
import MainRouter from "./app/routes";
import cookieParser from "cookie-parser";

const app: Application = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [config.front_end_url as string, "http://192.168.0.103:5173"],
    credentials: true,
  })
);

// Application Routes
app.use("/api", MainRouter);

app.get("/", (req, res) => {
  res.send("Chat app!");
});

export default app;
