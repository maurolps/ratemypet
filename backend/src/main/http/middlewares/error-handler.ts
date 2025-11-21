import { isAppError } from "@application/errors/app-error";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
) => {
  let errorResponse: HttpResponse = {
    body: {
      message: "Internal server error",
    },
    status: 500,
  };

  if (isAppError(error)) {
    errorResponse = ErrorPresenter(error);
    console.log(error.code, {
      route: request.originalUrl,
      ip: request.ip,
    });
  } else {
    console.log(error);
  }

  if (!response.headersSent) {
    response.status(errorResponse.status).json(errorResponse.body);
  }
};
