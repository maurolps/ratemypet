import { RefreshTokenController } from "@presentation/controllers/refresh-token.controller";
import { describe, expect, it } from "vitest";

describe("RefreshTokenController", () => {
  const makeSut = () => {
    const sut = new RefreshTokenController();
    return { sut };
  };

  it("Should return 200 on successful token refresh", async () => {
    const { sut } = makeSut();
    const dummyRequest = {};
    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
  });
});
