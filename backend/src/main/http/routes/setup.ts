import type { Express } from "express";
import { userRoutes } from "./user.routes";

export const setupRoutes = (app: Express) => {
  app.use("/health", (_req, res) => res.status(200).json({ body: "ok" }));
  app.use("/api", userRoutes);
};
