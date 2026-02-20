import { JwtAdapter } from "@infra/auth/jwt.adapter";
import { AuthMiddleware } from "@presentation/middlewares/auth-middleware";

export const makeAuthMiddleware = (optional = false) => {
  const jwtAdapter = new JwtAdapter();
  const authMiddleware = new AuthMiddleware(jwtAdapter, optional);
  return authMiddleware;
};
