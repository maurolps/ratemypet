import { FIXED_DATE } from "../config/constants";
import { LoginUseCase } from "@application/usecases/login.usecase";
import { FindUserRepositoryStub } from "./doubles/find-user.repository.stub";
import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { HasherStub } from "./doubles/hasher.stub";
import { TokenIssuerServiceStub } from "./doubles/token-issuer.service.stub";
import { AuthIdentityRepositoryStub } from "./doubles/auth-identity.repository.stub";

describe("LoginUseCase", () => {
  const makeSut = () => {
    const hasherStub = new HasherStub();
    const findUserStub = new FindUserRepositoryStub();
    const authIdentityRepositoryStub = new AuthIdentityRepositoryStub();
    const tokenIssuer = new TokenIssuerServiceStub();
    const sut = new LoginUseCase(
      findUserStub,
      authIdentityRepositoryStub,
      hasherStub,
      tokenIssuer,
    );
    return {
      sut,
      hasherStub,
      findUserStub,
      authIdentityRepositoryStub,
    };
  };

  it("Should throw UNAUTHORIZED error when user is not found", async () => {
    const { sut } = makeSut();
    const loginDTO = {
      email: "non_exists@mail.com",
      password: "any_password",
    };
    const promise = sut.auth(loginDTO);
    await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
  });

  it("Should throw UNAUTHORIZED error when password is incorrect", async () => {
    const { sut } = makeSut();
    const loginDTO = {
      email: "valid_email@mail.com",
      password: "wrong_password",
    };
    const promise = sut.auth(loginDTO);
    await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
  });

  it("Should throw UNAUTHORIZED error when user has no local auth identity", async () => {
    const { sut, authIdentityRepositoryStub } = makeSut();
    vi.spyOn(
      authIdentityRepositoryStub,
      "findByUserIdAndProvider",
    ).mockResolvedValueOnce(null);
    const loginDTO = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const promise = sut.auth(loginDTO);
    await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
  });

  it("Should throw UNAUTHORIZED error when auth identity has no password_hash", async () => {
    const { sut, authIdentityRepositoryStub } = makeSut();
    vi.spyOn(
      authIdentityRepositoryStub,
      "findByUserIdAndProvider",
    ).mockResolvedValueOnce({
      id: "valid_auth_identity_id",
      user_id: "valid_user_id",
      provider: "local",
      password_hash: null,
      provider_user_id: null,
      created_at: FIXED_DATE,
    });
    const loginDTO = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const promise = sut.auth(loginDTO);
    await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
  });

  it("Should return a logged user without password on success", async () => {
    const { sut } = makeSut();
    const loginDTO = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const loggedUser = await sut.auth(loginDTO);

    expect(loggedUser).toEqual({
      id: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      created_at: FIXED_DATE,
      tokens: {
        accessToken: "access_token",
        refreshToken: "refresh_token",
      },
    });
  });
});
