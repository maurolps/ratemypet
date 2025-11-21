import { describe, expect, it } from "vitest";
import { CryptoTokenGeneratorAdapter } from "@infra/auth/crypto-token-generator.adapter";

describe("CryptoTokenGenerator Adapter", () => {
  const sut = new CryptoTokenGeneratorAdapter();

  it("Should return crypto token in correct format", async () => {
    const ENCODED_ID_LENGTH = 16; // 8 bytes, hex
    const ENCODED_SECRET_LENGTH = 22; // 16 bytes, base64url

    const token = await sut.issue();
    const tokenParts = token.split(".");

    expect(tokenParts).toHaveLength(2);
    expect(tokenParts[0]).toHaveLength(ENCODED_ID_LENGTH);
    expect(tokenParts[1]).toHaveLength(ENCODED_SECRET_LENGTH);
  });
});
