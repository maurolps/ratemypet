import type { AccessTokenPayload } from "@domain/entities/token";

export type HttpRequest = {
  body?: unknown;
  cookies?: {
    refreshToken?: string;
  };
  headers?: {
    authorization?: string;
  };
  params?: Record<string, string>;
  user?: AccessTokenPayload;
  file?: {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
  };
};
