import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware";
import { routes } from "./routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.json({ status: "ok" });
});

app.use(routes);
app.use(errorMiddleware);
