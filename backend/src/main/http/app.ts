import express from "express";
import { setupGlobalMiddlewares } from "./middlewares/global";
import { setupRoutes } from "./routes/setup";

export const makeApp = () => {
  const app = express();
  setupGlobalMiddlewares(app);
  setupRoutes(app);
  return app;
};
