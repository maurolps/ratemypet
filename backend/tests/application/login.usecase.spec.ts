import type { AccessTokenPayload } from "@domain/entities/token";
import { LoginUseCase } from "@application/usecases/login.usecase";
import { FindUserByEmailRepositoryStub } from "./doubles/find-user-by-email.repository.stub";
import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { HasherStub } from "./doubles/hasher.stub";
import { TokenGeneratorStub } from "./doubles/token-generator.stub";

const makeAccessTokenGeneratorSpy = () => {
  const accessTokenGeneratorStub = new TokenGeneratorStub<AccessTokenPayload>();
  const accessTokenGeneratorSpy = vi.spyOn(accessTokenGeneratorStub, "issue");
  return { accessTokenGeneratorStub, accessTokenGeneratorSpy };
};

describe("LoginUseCase", () => {
  const makeSut = () => {
    const hasherStub = new HasherStub();
    const { accessTokenGeneratorStub, accessTokenGeneratorSpy } =
      makeAccessTokenGeneratorSpy();
    const findUserByEmailStub = new FindUserByEmailRepositoryStub();
    const sut = new LoginUseCase(
      findUserByEmailStub,
      hasherStub,
      accessTokenGeneratorStub,
    );
    return { sut, accessTokenGeneratorSpy };
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

  it("Should call TokenGenerator with correct values", async () => {
    const { sut, accessTokenGeneratorSpy } = makeSut();
    const loginDTO = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    await sut.auth(loginDTO);
    expect(accessTokenGeneratorSpy).toHaveBeenCalledWith({
      sub: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
    });
    expect(accessTokenGeneratorSpy).toHaveBeenCalledTimes(1);
  });

  it("Should reThrow if TokenGenerator throws", async () => {
    const { sut, accessTokenGeneratorSpy } = makeSut();
    accessTokenGeneratorSpy.mockImplementationOnce(() => {
      throw new Error("Error");
    });
    const loginDTO = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const promise = sut.auth(loginDTO);
    await expect(promise).rejects.toThrow();
  });
});
