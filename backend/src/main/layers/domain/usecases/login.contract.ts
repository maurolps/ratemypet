export interface LoginDTO {
  email: string;
  password: string;
}

export type AuthData = {
  accessToken: string;
  refreshToken: string;
};

export interface Login {
  auth(loginDTO: LoginDTO): Promise<AuthData>;
}
