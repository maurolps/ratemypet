import { BcryptAdapter } from "@infra/security/bcrypt.adapter";
import { CryptoTokenGeneratorAdapter } from "@infra/auth/crypto-token-generator.adapter";
import { PgRefreshTokenRepository } from "@infra/db/postgres/pg-refresh-token.repository";
import { JwtAdapter } from "@infra/auth/jwt.adapter";
import { TokenIssuerService } from "@application/services/token-issuer.service";

export const makeTokenIssuer = () => {
  const accessTokenGenerator = new JwtAdapter();
  const hasher = new BcryptAdapter();
  const refreshTokenGenerator = new CryptoTokenGeneratorAdapter();
  const refreshTokenRepository = new PgRefreshTokenRepository();
  const tokenIssuer = new TokenIssuerService(
    hasher,
    accessTokenGenerator,
    refreshTokenGenerator,
    refreshTokenRepository,
  );
  return tokenIssuer;
};
