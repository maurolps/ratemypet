import { LoginUseCase } from "@application/usecases/login.usecase";
import { FindUserByEmailRepositoryStub } from "./doubles/find-user-by-email.repository.stub";
import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { HasherStub } from "./doubles/hasher.stub";
import { TokenGeneratorStub } from "./doubles/token-generator.stub";
import e from "express";

describe("LoginUseCase", () => {
  const makeSut = () => {
    const hasherStub = new HasherStub();
    const tokenGeneratorStub = new TokenGeneratorStub();
    const tokenGeneratorSpy = vi.spyOn(tokenGeneratorStub, "issue");
    const findUserByEmailStub = new FindUserByEmailRepositoryStub();
    const sut = new LoginUseCase(
      findUserByEmailStub,
      hasherStub,
      tokenGeneratorStub,
    );
    return { sut, tokenGeneratorSpy };
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
    const { sut, tokenGeneratorSpy } = makeSut();
    const loginDTO = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    await sut.auth(loginDTO);
    expect(tokenGeneratorSpy).toHaveBeenCalledWith({
      sub: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
    });
  });
});
