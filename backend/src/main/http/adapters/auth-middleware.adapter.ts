import type { NextFunction, Request, Response } from "express";
import type { AuthenticateMiddleware } from "@presentation/contracts/middleware.contract";

export const authMiddlewareAdapter = (
  authMiddleware: AuthenticateMiddleware,
) => {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const httpRequest = {
      headers: {
        authorization: request.headers.authorization,
      },
    };
    const authenticatedUser = await authMiddleware.handle(httpRequest);
    request.user = authenticatedUser;
    return next();
  };
};
