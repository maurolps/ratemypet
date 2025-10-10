import type { ERROR_CODE } from "@application/errors/error-codes";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { isAppError } from "@application/errors/app-error";
import {
  badRequest,
  conflict,
  serverError,
} from "@presentation/http/http-helpers";

type ErrorResponseType = {
  [key in ERROR_CODE]: (detail?: string) => HttpResponse;
};

const ErrorResponse: ErrorResponseType = {
  EMAIL_TAKEN: () => conflict("Email already in use"),
  MISSING_BODY: () => badRequest("Missing request body"),
  MISSING_PARAM: (detail) => badRequest(`Missing Param: ${detail}`),
  INVALID_PARAM: (detail) => badRequest(`Invalid Param: ${detail}`),
  WEAK_PASSWORD: () =>
    badRequest(
      "Invalid Param: <password> should be at least 6 characters long",
    ),
  INVALID_NAME: () =>
    badRequest("Invalid Param: <name> should be at least 3 characters long"),
};

export const ErrorPresenter = (error: unknown): HttpResponse => {
  if (isAppError(error)) {
    const response = ErrorResponse[error.code](error.detail);
    return response;
  }
  return serverError(error);
};
