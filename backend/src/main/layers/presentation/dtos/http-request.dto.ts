import type { AccessTokenPayload } from "@domain/entities/token";

export type HttpRequest = {
  body?: unknown;
  cookies?: {
    refreshToken?: string;
  };
  headers?: {
    authorization?: string;
  };
  user?: Omit<AccessTokenPayload, "exp" | "iat">;
  file?: {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
  };
};

export type AuthenticatedRequest = {
  user: Omit<AccessTokenPayload, "exp" | "iat">;
};
