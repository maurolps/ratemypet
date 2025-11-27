import type { TokenIssuer } from "@domain/entities/token";
import type { Hasher } from "@application/ports/hasher.contract";
import type { FindUserRepository } from "@application/repositories/find-user.repository";
import type {
  LoggedUser,
  Login,
  LoginDTO,
} from "@domain/usecases/login.contract";
import { AppError } from "@application/errors/app-error";

export class LoginUseCase implements Login {
  constructor(
    private readonly findUser: FindUserRepository,
    private readonly hasher: Hasher,
    private readonly tokenIssuer: TokenIssuer,
  ) {}

  async auth(loginDTO: LoginDTO): Promise<LoggedUser> {
    const user = await this.findUser.findByEmail(loginDTO.email);
    if (!user || !user.password_hash) {
      throw new AppError("UNAUTHORIZED");
    }
    if (!(await this.hasher.compare(loginDTO.password, user.password_hash))) {
      throw new AppError("UNAUTHORIZED");
    }

    const tokens = await this.tokenIssuer.execute(user);
    const { password_hash: _, ...userWithoutPassword } = user;
    const loggedUser = {
      ...userWithoutPassword,
      tokens,
    };

    return loggedUser;
  }
}
