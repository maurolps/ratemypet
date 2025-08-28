import type { User } from "@domain/entities/user";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";

export const created = (user: User): HttpResponse => ({
  status: 201,
  body: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
});

export const conflict = (message: string): HttpResponse => ({
  status: 409,
  body: {
    message,
    name: "ConflictError",
  },
});

export const serverError = (): HttpResponse => ({
  status: 500,
  body: {
    name: "ServerError",
    message: "Internal server error",
  },
});

export const badRequest = (message: string): HttpResponse => ({
  status: 400,
  body: {
    message,
    name: "BadRequestError",
  },
});
