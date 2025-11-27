import type { Hasher } from "@application/ports/hasher.contract";

export class HasherStub implements Hasher {
  hash(secret: string): Promise<string> {
    return Promise.resolve(`hashed_${secret}`);
  }
  compare(plainSecret: string, hashedSecret: string): Promise<boolean> {
    return Promise.resolve(hashedSecret === `hashed_${plainSecret}`);
  }
}
