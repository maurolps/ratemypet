import { type Express, json } from "express";
import cors from "cors";
import helmet from "helmet";
import { contentType } from "./content-type";

export const setupGlobalMiddlewares = (app: Express) => {
  app.use(helmet());
  app.use(cors());
  app.use(contentType);
  app.use(json());
};
