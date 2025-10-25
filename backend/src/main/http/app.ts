import express from "express";
import { setupRoutes } from "./routes/setup";
import { setupGlobalMiddlewares } from "./middlewares/global";
import { errorHandler } from "./middlewares/error-handler";
import { setupSwagger } from "./middlewares/swagger";

export const makeApp = () => {
  const app = express();
  setupSwagger(app);
  setupGlobalMiddlewares(app);
  setupRoutes(app);
  app.use(errorHandler);
  return app;
};
