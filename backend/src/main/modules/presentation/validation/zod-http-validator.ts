import type { z } from "zod";
import type { CreateUserDTO } from "@domain/usecases/create-user.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { createUserSchema } from "@presentation/validation/create-user.schema";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { ERROR_CODE } from "@application/errors/error-codes";
import { AppError } from "@application/errors/app-error";

type Schema = z.infer<typeof createUserSchema>;

export class ZodHttpValidator implements HttpValidator {
  constructor(private readonly schema: z.ZodType) {}

  execute(request: HttpRequest): CreateUserDTO {
    const parsed = this.schema.safeParse(request);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const error = issue.message as ERROR_CODE;
      const issueField = issue.path.at(-1)?.toString();

      if (error === "MISSING_PARAM" || error === "INVALID_PARAM") {
        throw new AppError(error, issueField);
      }

      throw new AppError(error);
    }

    const userDTO = (parsed.data as Schema).body;
    return userDTO;
  }
}
