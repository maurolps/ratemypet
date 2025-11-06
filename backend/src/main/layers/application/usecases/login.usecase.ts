import type { AccessTokenPayload } from "@domain/entities/token";
import type { Hasher } from "@application/ports/hasher.contract";
import type { TokenGenerator } from "@application/ports/token-generator.contract";
import type { FindUserByEmailRepository } from "@application/repositories/find-user-by-email.repository";
import type {
  AuthData,
  Login,
  LoginDTO,
} from "@domain/usecases/login.contract";
import { AppError } from "@application/errors/app-error";

export class LoginUseCase implements Login {
  constructor(
    private readonly findUserByEmail: FindUserByEmailRepository,
    private readonly hasher: Hasher,
    private readonly accessTokenGenerator: TokenGenerator<AccessTokenPayload>,
    private readonly refreshTokenGenerator: TokenGenerator,
  ) {}

  async auth(loginDTO: LoginDTO): Promise<AuthData> {
    const user = await this.findUserByEmail.findByEmail(loginDTO.email);
    if (!user || !user.password_hash) {
      throw new AppError("UNAUTHORIZED");
    }
    if (!(await this.hasher.compare(loginDTO.password, user.password_hash))) {
      throw new AppError("UNAUTHORIZED");
    }

    const accessToken = await this.accessTokenGenerator.issue({
      sub: user.id,
      name: user.name,
      email: user.email,
    });
    const refreshTokenRaw = await this.refreshTokenGenerator.issue();

    const [tokenId, tokenSecret] = refreshTokenRaw.split(".");
    if (!tokenId || !tokenSecret) {
      throw new Error();
    }

    const _refreshTokenHash = await this.hasher.hash(tokenSecret);

    return {
      accessToken: accessToken,
      refreshToken: refreshTokenRaw,
    };
  }
}
