import type { Hasher } from "@application/ports/hasher.contract";

export class HashPasswordStub implements Hasher {
  execute(password: string): string {
    return `hashed_${password}`;
  }
}
