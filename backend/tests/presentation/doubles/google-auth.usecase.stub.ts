import { FIXED_DATE } from "../../config/constants";
import type {
  GoogleAuth,
  GoogleAuthDTO,
} from "@domain/usecases/google-auth.contract";

export class GoogleAuthUseCaseStub implements GoogleAuth {
  async auth(_googleAuthDTO: GoogleAuthDTO) {
    return {
      id: "valid_user_id",
      email: "google_user@mail.com",
      displayName: "Google User",
      bio: "Pet lover 🐶",
      picture: "https://valid.picture/google.png",
      createdAt: FIXED_DATE,
      tokens: {
        accessToken: "valid_access_token",
        refreshToken: "valid_refresh_token",
      },
    };
  }
}
