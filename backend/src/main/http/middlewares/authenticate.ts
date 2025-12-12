import { makeAuthMiddleware } from "@main/composition/auth/auth-middleware.factory";
import { authMiddlewareAdapter } from "../adapters/auth-middleware.adapter";

export const authMiddleware = () => authMiddlewareAdapter(makeAuthMiddleware());
