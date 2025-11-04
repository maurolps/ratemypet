import type { FindUserByEmailRepository } from "@application/repositories/find-user-by-email.repository";
import type {
  AuthData,
  Login,
  LoginDTO,
} from "@domain/usecases/login.contract";
import { AppError } from "@application/errors/app-error";

export class LoginUseCase implements Login {
  constructor(private readonly findUserByEmail: FindUserByEmailRepository) {}

  async auth(loginDTO: LoginDTO): Promise<AuthData> {
    const user = await this.findUserByEmail.findByEmail(loginDTO.email);
    if (!user) {
      throw new AppError("UNAUTHORIZED");
    }
    return {
      accessToken: "generated_access_token",
      refreshToken: "generated_refresh_token",
    };
  }
}
