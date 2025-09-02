import { AppError } from "@presentation/errors/app-error";
import type { CreateUserDTO } from "@domain/usecases/create-user";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { createUserSchema } from "./create-user.schema";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { z } from "zod";
import type { ERROR_CODE } from "@presentation/errors/error-codes";

export class ZodHttpValidator implements HttpValidator {
  constructor(private readonly schema: z.ZodType) {}
  execute(request: HttpRequest): CreateUserDTO {
    type Schema = z.infer<typeof createUserSchema>;

    const parsed = this.schema.safeParse(request);
    if (!parsed.success) {
      const error = parsed.error.issues[0].message as ERROR_CODE;
      throw new AppError(error);
    }

    const userDTO = (parsed.data as Schema).body;
    return userDTO;
  }
}
