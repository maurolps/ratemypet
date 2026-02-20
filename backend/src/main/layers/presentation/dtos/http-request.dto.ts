import type { AccessTokenPayload } from "@domain/entities/token";

export type HttpRequest = {
  body?: unknown;
  cookies?: {
    refreshToken?: string;
  };
  query?: Record<string, unknown>;
  headers?: {
    authorization?: string;
    idempotency_key?: string;
  };
  params?: Record<string, string>;
  user?: AccessTokenPayload;
  file?: {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
  };
};
