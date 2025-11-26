import { describe, expect, it, vi } from "vitest";
import { RefreshTokenRepositoryStub } from "./doubles/refresh-token.repository.stub";
import { RefreshTokenUseCase } from "@application/usecases/refresh-token.usecase";

describe("RefreshTokenUseCase", () => {
  it("Should call RefreshTokenRepository.findById with correct values", async () => {
    const refreshTokenRepositoryStub = new RefreshTokenRepositoryStub();
    const findByIdSpy = vi.spyOn(refreshTokenRepositoryStub, "findById");
    const sut = new RefreshTokenUseCase(refreshTokenRepositoryStub);
    const dummyToken = {
      id: "refresh_token_id",
      secret: "refresh_token_secret",
    };
    await sut.execute(dummyToken);
    expect(findByIdSpy).toHaveBeenCalledWith("refresh_token_id");
  });
});
