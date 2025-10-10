import express from "express";
import { setupRoutes } from "./routes/setup";
import { setupGlobalMiddlewares } from "./middlewares/global";
import { errorHandler } from "./middlewares/error-handler";

export const makeApp = () => {
  const app = express();
  setupGlobalMiddlewares(app);
  setupRoutes(app);
  app.use(errorHandler);
  return app;
};
