import type { Hasher } from "@application/ports/hasher.contract";

export class HasherStub implements Hasher {
  hash(password: string): Promise<string> {
    return Promise.resolve(`hashed_${password}`);
  }
  compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return Promise.resolve(hashedPassword === `hashed_${plainPassword}`);
  }
}
