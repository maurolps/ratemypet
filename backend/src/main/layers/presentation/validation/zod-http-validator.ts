import type { z } from "zod";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { ERROR_CODE } from "@application/errors/error-codes";
import { AppError } from "@application/errors/app-error";

export class ZodHttpValidator<T> implements HttpValidator<T> {
  constructor(private readonly schema: z.ZodType) {}

  execute(request: HttpRequest): T {
    const parsed = this.schema.safeParse(request);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const error = issue.message as ERROR_CODE;
      const issueField = issue.path.at(-1)?.toString();

      if (error === "MISSING_PARAM" || error === "INVALID_PARAM") {
        throw new AppError(error, issueField);
      }

      if (error === "UNPROCESSABLE_ENTITY") {
        throw new AppError(error, "Invalid image type");
      }

      throw new AppError(error);
    }

    const data = parsed.data as T;

    return data;
  }
}
