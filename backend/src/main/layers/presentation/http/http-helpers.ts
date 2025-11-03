import type { User } from "@domain/entities/user";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";

export const ok = (message: string): HttpResponse => ({
  status: 200,
  body: {
    message,
  },
});

export const created = (user: User): HttpResponse => ({
  status: 201,
  body: {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  },
});

export const conflict = (message: string): HttpResponse => ({
  status: 409,
  body: {
    message,
    name: "ConflictError",
  },
});

export const serverError = (error: unknown): HttpResponse => {
  throw error;
};

export const badRequest = (message: string): HttpResponse => ({
  status: 400,
  body: {
    message,
    name: "BadRequestError",
  },
});

export const unauthorized = (): HttpResponse => ({
  status: 401,
  body: {
    message: "Invalid credentials",
    name: "Unauthorized",
  },
});
