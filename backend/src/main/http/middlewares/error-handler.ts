import { isAppError } from "@application/errors/app-error";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";

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

  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        errorResponse = {
          status: 400,
          body: { message: "File size exceeds the allowed limit." },
        };
        break;
      case "LIMIT_UNEXPECTED_FILE":
      case "LIMIT_FILE_COUNT":
        errorResponse = {
          status: 400,
          body: { message: "Only one file (image) is allowed." },
        };
        break;
      default:
        errorResponse = {
          status: 400,
          body: { message: "Invalid image upload." },
        };
    }
  }

  if (isAppError(error)) {
    errorResponse = ErrorPresenter(error);
  } else {
    console.log(error, {
      route: request.originalUrl,
      ip: request.ip,
    });
  }

  if (!response.headersSent) {
    response.status(errorResponse.status).json(errorResponse.body);
  }
};
