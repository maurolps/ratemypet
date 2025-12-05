import { FIXED_DATE } from "../config/constants";
import { LoginUseCase } from "@application/usecases/login.usecase";
import { FindUserRepositoryStub } from "./doubles/find-user.repository.stub";
import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { HasherStub } from "./doubles/hasher.stub";
import { TokenIssuerServiceStub } from "./doubles/token-issuer.service.stub";

describe("LoginUseCase", () => {
  const makeSut = () => {
    const hasherStub = new HasherStub();
    const findUserStub = new FindUserRepositoryStub();
    const tokenIssuer = new TokenIssuerServiceStub();
    const sut = new LoginUseCase(findUserStub, hasherStub, tokenIssuer);
    return {
      sut,
      hasherStub,
      findUserStub,
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

  it("Should throw UNAUTHORIZED error when user has no password_hash", async () => {
    const { sut, findUserStub } = makeSut();
    vi.spyOn(findUserStub, "findByEmail").mockResolvedValueOnce({
      id: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password_hash: undefined,
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
