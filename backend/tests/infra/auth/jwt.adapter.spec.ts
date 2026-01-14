import { JwtAdapter } from "@infra/auth/jwt.adapter";
import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import { env } from "@main/config/env";

describe("JwtAdapter", () => {
  const sut = new JwtAdapter();
  const signSpy = vi.spyOn(jwt, "sign");
  const verifySpy = vi.spyOn(jwt, "verify");
  const dummyPayload = {
    sub: "any_sub",
    name: "any_name",
    email: "any_email",
  };
  const dummyToken = "any_access_token";

  it("Should call JWT sign with correct values", async () => {
    const jwtSecret = env.JWT_ACCESS_TOKEN_SECRET;
    const jwtExpiresIn = env.JWT_ACCESS_TOKEN_TTL;
    signSpy.mockImplementationOnce(() => "issued_access_token");

    await sut.issue(dummyPayload);
    expect(signSpy).toHaveBeenCalledWith(dummyPayload, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
    expect(signSpy).toHaveBeenCalledTimes(1);
  });

  it("Should rethrow if JWT throws", async () => {
    signSpy.mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.issue(dummyPayload);
    await expect(promise).rejects.toThrow();
  });

  it("Should return a valid access token on success", async () => {
    signSpy.mockImplementationOnce(() => "issued_access_token");

    const accessToken = await sut.issue(dummyPayload);
    expect(accessToken).toBe("issued_access_token");
  });

  it("Should call JWT verify with correct values", async () => {
    const jwtSecret = env.JWT_ACCESS_TOKEN_SECRET;
    verifySpy.mockImplementationOnce(() => dummyPayload);

    await sut.verify(dummyToken);
    expect(verifySpy).toHaveBeenCalledWith(dummyToken, jwtSecret);
    expect(verifySpy).toHaveBeenCalledTimes(1);
  });

  it("Should rethrow if JWT verify throws", async () => {
    verifySpy.mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.verify(dummyToken);
    await expect(promise).rejects.toThrow();
  });

  it("Should return a valid payload on verify success", async () => {
    verifySpy.mockImplementationOnce(() => dummyPayload);

    const payload = await sut.verify(dummyToken);
    expect(payload).toEqual(dummyPayload);
  });
});
