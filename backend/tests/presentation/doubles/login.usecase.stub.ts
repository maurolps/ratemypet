import { FIXED_DATE } from "../../config/constants";
import type {
  LoggedUser,
  Login,
  LoginDTO,
} from "@domain/usecases/login.contract";

export class LoginUseCaseStub implements Login {
  async auth(_loginDTO: LoginDTO): Promise<LoggedUser> {
    return {
      id: "valid_user_id",
      email: "valid_email@mail.com",
      displayName: "valid_display_name",
      bio: "Pet lover 🐶",
      createdAt: FIXED_DATE,
      tokens: {
        accessToken: "valid_access_token",
        refreshToken: "valid_refresh_token",
      },
    };
  }
}
