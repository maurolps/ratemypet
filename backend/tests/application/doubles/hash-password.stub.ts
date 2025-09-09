import type { Hasher } from "@application/ports/hasher.contract";

export class HashPasswordStub implements Hasher {
  execute(password: string): Promise<string> {
    return Promise.resolve(`hashed_${password}`);
  }
}
