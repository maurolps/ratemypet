import { JwtAdapter } from "@infra/auth/jwt.adapter";
import { AuthMiddleware } from "@presentation/middlewares/auth-middleware";

export const makeAuthMiddleware = () => {
  const jwtAdapter = new JwtAdapter();
  const authMiddleware = new AuthMiddleware(jwtAdapter);
  return authMiddleware;
};
