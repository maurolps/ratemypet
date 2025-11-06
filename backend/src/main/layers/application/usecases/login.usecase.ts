import type {
  AccessTokenPayload,
  RefreshTokenDTO,
} from "@domain/entities/token";
import type { Hasher } from "@application/ports/hasher.contract";
import type { TokenGenerator } from "@application/ports/token-generator.contract";
import type { FindUserByEmailRepository } from "@application/repositories/find-user-by-email.repository";
import type { RefreshTokenRepository } from "@application/repositories/refresh-token-repository";
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
    private readonly refreshTokenRepository: RefreshTokenRepository,
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

    const [id, secret] = refreshTokenRaw.split(".");
    if (!id || !secret) {
      throw new Error();
    }

    const refreshTokenHash = await this.hasher.hash(secret);
    const refreshTokenDTO: RefreshTokenDTO = {
      id,
      user_id: user.id,
      token_hash: refreshTokenHash,
    };

    await this.refreshTokenRepository.save(refreshTokenDTO);

    return {
      accessToken,
      refreshToken: refreshTokenRaw,
    };
  }
}
