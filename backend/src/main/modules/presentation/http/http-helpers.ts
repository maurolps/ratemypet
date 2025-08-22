import type { User } from "../../domain/entities/user";
import type { HttpResponse } from "../dtos/http-response.dto";

export const created = (user: User): HttpResponse => ({
  status: 201,
  body: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
});

export const conflict = (error: string): HttpResponse => ({
  status: 409,
  error,
});

export const serverError = (error: string): HttpResponse => ({
  status: 500,
  error,
});
