import { LoginUseCase } from "@application/usecases/login.usecase";
import { FindUserByEmailRepositoryStub } from "./doubles/find-user-by-email.repository.stub";
import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { HasherStub } from "./doubles/hasher.stub";

describe("LoginUseCase", () => {
  it("Should throw UNAUTHORIZED error when user is not found", async () => {
    const loginDTO = {
      email: "non_exists@mail.com",
      password: "any_password",
    };
    const hasherStub = new HasherStub();
    const findUserByEmail = new FindUserByEmailRepositoryStub();
    const sut = new LoginUseCase(findUserByEmail, hasherStub);
    const promise = sut.auth(loginDTO);
    await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
  });

  it("Should throw UNAUTHORIZED error when password is incorrect", async () => {
    const loginDTO = {
      email: "valid_email@mail.com",
      password: "wrong_password",
    };
    const hasherStub = new HasherStub();
    const findUserByEmail = new FindUserByEmailRepositoryStub();
    vi.spyOn(findUserByEmail, "findByEmail").mockResolvedValueOnce({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      created_at: new Date(),
      password_hash: "hashed_valid_password",
    });
    const sut = new LoginUseCase(findUserByEmail, hasherStub);
    const promise = sut.auth(loginDTO);
    await expect(promise).rejects.toThrow(new AppError("UNAUTHORIZED"));
  });
});
