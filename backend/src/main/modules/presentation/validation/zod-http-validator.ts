import { AppError } from "@presentation/errors/app-error";
import type { CreateUserDTO } from "@domain/usecases/create-user";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { createUserSchema } from "./create-user.schema";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { z } from "zod";
import type { ERROR_CODE } from "@presentation/errors/error-codes";

type Schema = z.infer<typeof createUserSchema>;

export class ZodHttpValidator implements HttpValidator {
  constructor(private readonly schema: z.ZodType) {}

  execute(request: HttpRequest): CreateUserDTO {
    const parsed = this.schema.safeParse(request);
    let detail: string | undefined;

    if (!parsed.success) {
      const error = parsed.error.issues[0].message as ERROR_CODE;
      if (error === "MISSING_PARAM" || error === "INVALID_PARAM") {
        detail = parsed.error.issues[0].path.at(-1)?.toString();
      }
      throw new AppError(error, detail);
    }

    const userDTO = (parsed.data as Schema).body;
    return userDTO;
  }
}
