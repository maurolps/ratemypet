import type { NextFunction, Request, Response } from "express";
import type { Middleware } from "@presentation/contracts/middleware.contract";

export const authMiddlewareAdapter = (middleware: Middleware) => {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const httpRequest = {
      headers: {
        authorization: request.headers.authorization,
      },
    };
    const authenticatedRequest = await middleware.handle(httpRequest);
    // @ts-ignore
    request.user = authenticatedRequest.user;
    return next();
  };
};
