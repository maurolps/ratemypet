import type { Tokens } from "@domain/entities/token";

export type RefreshTokenParsed = {
  id: string;
  secret: string;
};

export interface RefreshToken {
  execute(token: RefreshTokenParsed): Promise<Tokens>;
}
