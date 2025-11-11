import type { Hasher } from "@application/ports/hasher.contract";
import type { FindUserByEmailRepository } from "@application/repositories/find-user-by-email.repository";
import type { TokenIssuerService } from "@application/services/token-issuer.service";
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
    private readonly tokenIssuer: TokenIssuerService,
  ) {}

  async auth(loginDTO: LoginDTO): Promise<AuthData> {
    const user = await this.findUserByEmail.findByEmail(loginDTO.email);
    if (!user || !user.password_hash) {
      throw new AppError("UNAUTHORIZED");
    }
    if (!(await this.hasher.compare(loginDTO.password, user.password_hash))) {
      throw new AppError("UNAUTHORIZED");
    }

    const tokens = await this.tokenIssuer.execute(user);

    return tokens;
  }
}
