import type { LoggedUser } from "./login.contract";

export interface GoogleAuthDTO {
  id_token: string;
}

export interface GoogleAuth {
  auth(googleAuthDTO: GoogleAuthDTO): Promise<LoggedUser>;
}
