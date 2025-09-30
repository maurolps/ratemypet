import type { NextFunction, Request, Response } from "express";

export const contentType = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.type("application/json");
  next();
};
