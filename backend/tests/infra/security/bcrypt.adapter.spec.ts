import bcrypt from "bcrypt";
import { BcryptAdapter } from "@infra/security/bcrypt.adapter";
import { vi, it, describe, expect } from "vitest";

describe("Bcrypt Adapter", () => {
  const SALT_ROUNDS = 12;
  const sut = new BcryptAdapter();

  it("Should call bcrypt with correct salt value", async () => {
    const hashSpy = vi.spyOn(bcrypt, "hash");
    await sut.execute("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", SALT_ROUNDS);
  });
});
