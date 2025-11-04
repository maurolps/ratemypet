import { LoginUseCase } from "@application/usecases/login.usecase";
import { FindUserByEmailRepositoryStub } from "./doubles/find-user-by-email.repository.stub";
import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { HasherStub } from "./doubles/hasher.stub";

describe("LoginUseCase", () => {
  const makeSut = () => {
    const hasherStub = new HasherStub();
    const findUserByEmailStub = new FindUserByEmailRepositoryStub();
    const findUserByEmailSpy = vi.spyOn(findUserByEmailStub, "findByEmail");
    const sut = new LoginUseCase(findUserByEmailStub, hasherStub);
    return { sut, findUserByEmailStub, hasherStub, findUserByEmailSpy };
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
    const { sut, findUserByEmailSpy } = makeSut();
    const loginDTO = {
      email: "valid_email@mail.com",
      password: "wrong_password",
    };
    findUserByEmailSpy.mockResolvedValueOnce({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      created_at: new Date(),
      password_hash: "hashed_valid_password",
    });
    const promise = sut.auth(loginDTO);
    await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
  });
});
