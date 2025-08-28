import { isAppError } from "./app-error";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { conflict, serverError } from "@presentation/http/http-helpers";
import type { ERROR_CODE } from "./error-codes";

const ErrorResponse = {
  EMAIL_TAKEN: conflict("Email already in use"),
  // INVALID_EMAIL: conflict("..."),
} as const satisfies Record<ERROR_CODE, HttpResponse>;

export const ErrorPresenter = (err: unknown): HttpResponse => {
  if (isAppError(err)) {
    const response = ErrorResponse[err.code];
    return response;
  }
  return serverError();
};
