import { isDomainError } from "../../domain/errors/domain-error";
import type { HttpResponse } from "../dtos/http-response.dto";
import { conflict, serverError } from "../http/http-helpers";

export const ErrorPresenter = (err: unknown): HttpResponse => {
  if (isDomainError(err)) {
    switch (err.code) {
      case "EMAIL_TAKEN":
        return conflict("Email already in use");
    }
  }
  return serverError("Internal server error");
};
