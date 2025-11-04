import bcrypt from "bcrypt";
import { BcryptAdapter } from "@infra/security/bcrypt.adapter";
import { vi, it, describe, expect } from "vitest";

describe("Bcrypt Adapter", () => {
  const SALT_ROUNDS = 12;
  const sut = new BcryptAdapter();
  const bcryptSpy = vi.spyOn(bcrypt, "hash");

  it("Should call bcrypt with correct salt value", async () => {
    const hashSpy = bcryptSpy.mockImplementationOnce(() => "hashed_password");
    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", SALT_ROUNDS);
  });

  it("Should rethrow if bcrypt throws", async () => {
    bcryptSpy.mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.hash("any_value");
    await expect(promise).rejects.toThrow();
  });
});
