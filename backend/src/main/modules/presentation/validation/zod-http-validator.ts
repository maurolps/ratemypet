import { AppError } from "@presentation/errors/app-error";
import type { CreateUserDTO } from "@domain/usecases/create-user";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { createUserSchema } from "./create-user.schema";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { z } from "zod";

export class ZodHttpValidator implements HttpValidator {
  constructor(private readonly schema: z.ZodType) {}
  execute(request: HttpRequest): CreateUserDTO {
    type Schema = z.infer<typeof createUserSchema>;

    const parsed = this.schema.safeParse(request);
    if (!parsed.success) {
      throw new AppError("MISSING_BODY");
    }

    const userDTO = (parsed.data as Schema).body;
    return userDTO;
  }
}
