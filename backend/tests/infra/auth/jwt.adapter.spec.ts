import { JwtAdapter } from "@infra/auth/jwt.adapter";
import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";

describe("JwtAdapter", () => {
  const sut = new JwtAdapter();
  const signSpy = vi.spyOn(jwt, "sign");
  const dummyPayload = {
    sub: "any_sub",
    name: "any_name",
    email: "any_email",
  };

  it("Should call JWT sign with correct values", async () => {
    const jwtSecret = expect.any(String);
    signSpy.mockImplementationOnce(() => "issued_access_token");

    await sut.issue(dummyPayload);
    expect(signSpy).toHaveBeenCalledWith(dummyPayload, jwtSecret);
    expect(signSpy).toHaveBeenCalledTimes(1);
  });

  it("Should rethrow if JWT throws", async () => {
    signSpy.mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.issue(dummyPayload);
    await expect(promise).rejects.toThrow();
  });
});
