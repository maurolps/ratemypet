import type { AccessTokenPayload } from "@domain/entities/token";

declare module "express-serve-static-core" {
  interface Request {
    user?: AccessTokenPayload;
  }
}
