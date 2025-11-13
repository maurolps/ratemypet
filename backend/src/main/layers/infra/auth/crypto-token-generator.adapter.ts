import type { TokenGenerator } from "@application/ports/token-generator.contract";
import { randomBytes } from "node:crypto";
import { promisify } from "node:util";

const randomBytesAsync = promisify(randomBytes);

export class CryptoTokenGeneratorAdapter implements TokenGenerator {
  async issue(): Promise<string> {
    const ID_BUFFER_SIZE = 8;
    const SECRET_BUFFER_SIZE = 16;

    const idBuffer = await randomBytesAsync(ID_BUFFER_SIZE);
    const secretBuffer = await randomBytesAsync(SECRET_BUFFER_SIZE);

    const id = idBuffer.toString("hex");
    const secret = secretBuffer.toString("base64url");

    return `${id}.${secret}`;
  }
}
