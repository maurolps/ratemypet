import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) => {
  // Call logger method here
  console.log(error);

  if (!response.headersSent) {
    response.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
};
