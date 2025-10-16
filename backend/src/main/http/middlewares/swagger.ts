import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import openApiDocs from "../../../docs-api";

export const setupSwagger = (app: Express) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocs));
};
