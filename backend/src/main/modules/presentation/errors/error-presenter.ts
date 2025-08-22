import { isDomainError } from "../../domain/errors/domain-error";
import type { HttpResponse } from "../dtos/http-response.dto";

export const ErrorPresenter = (err: unknown): HttpResponse => {
  if (isDomainError(err)) {
    switch (err.code) {
      case "EMAIL_TAKEN":
        return { error: "Email already in use", status: 409 };
    }
  }
  return { error: "Internal server error", status: 500 };
};
