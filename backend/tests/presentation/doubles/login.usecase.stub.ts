import type {
  LoggedUser,
  Login,
  LoginDTO,
} from "@domain/usecases/login.contract";

export class LoginUseCaseStub implements Login {
  async auth(_loginDTO: LoginDTO): Promise<LoggedUser> {
    return {
      id: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      created_at: new Date(),
      tokens: {
        accessToken: "valid_access_token",
        refreshToken: "valid_refresh_token",
      },
    };
  }
}
