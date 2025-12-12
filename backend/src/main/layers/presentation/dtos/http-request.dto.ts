import type { AccessTokenPayload } from "@domain/entities/token";

export type HttpRequest = {
  body?: unknown;
  cookies?: Record<string, string>;
  headers?: Record<string, string | undefined>;
};

export type AuthenticatedRequest = {
  user: Omit<AccessTokenPayload, "exp" | "iat">;
};
