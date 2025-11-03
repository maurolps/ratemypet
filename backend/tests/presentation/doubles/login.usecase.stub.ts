import type {
  AuthData,
  Login,
  LoginDTO,
} from "@domain/usecases/login.contract";

export class LoginUseCaseStub implements Login {
  async auth(_loginDTO: LoginDTO): Promise<AuthData> {
    return {
      accessToken: "valid_access_token",
      refreshToken: "valid_refresh_token",
    };
  }
}
