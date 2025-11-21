import bcrypt from "bcrypt";
import type { Hasher } from "@application/ports/hasher.contract";

export class BcryptAdapter implements Hasher {
  private readonly SALT_ROUNDS = 12;

  async hash(plainPassword: string): Promise<string> {
    const hash = await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
    return hash;
  }

  async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
