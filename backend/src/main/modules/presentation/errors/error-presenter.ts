import { isAppError } from "./app-error";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import {
  badRequest,
  conflict,
  serverError,
} from "@presentation/http/http-helpers";
import type { ERROR_CODE } from "./error-codes";

type ErrorResponseType = {
  [key in ERROR_CODE]: (detail?: string) => HttpResponse;
};

const ErrorResponse: ErrorResponseType = {
  EMAIL_TAKEN: () => conflict("Email already in use"),
  MISSING_BODY: () => badRequest("Missing request body"),
  MISSING_PARAM: (detail) => badRequest(`Missing Param: ${detail}`),
  INVALID_PARAM: (detail) => badRequest(`Invalid Param: ${detail}`),
};

export const ErrorPresenter = (error: unknown): HttpResponse => {
  if (isAppError(error)) {
    const response = ErrorResponse[error.code](error.detail);
    return response;
  }
  return serverError();
};
