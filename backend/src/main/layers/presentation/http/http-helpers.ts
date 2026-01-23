import type { LoggedUser } from "@domain/usecases/login.contract";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";

export const ok = (body: HttpResponse["body"]): HttpResponse => ({
  status: 200,
  body,
});

export const created = (loggedUser: LoggedUser): HttpResponse => ({
  status: 201,
  body: loggedUser,
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

export const unprocessableEntity = (message: string): HttpResponse => ({
  status: 422,
  body: {
    message,
    name: "UnprocessableEntity",
  },
});

export const tooManyRequests = (message: string): HttpResponse => ({
  status: 429,
  body: {
    message,
    name: "RateLimitExceeded",
  },
});

export const forbidden = (message: string): HttpResponse => ({
  status: 403,
  body: {
    message,
    name: "Forbidden",
  },
});

export const notFound = (message: string): HttpResponse => ({
  status: 404,
  body: {
    message,
    name: "NotFound",
  },
});
