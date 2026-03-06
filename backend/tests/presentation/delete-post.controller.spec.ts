import { describe, expect, it, vi } from "vitest";
import { DeletePostController } from "@presentation/controllers/delete-post.controller";
import { DeletePostValidatorStub } from "./doubles/delete-post.validator.stub";
import { DeletePostUseCaseStub } from "./doubles/delete-post.usecase.stub";
import { AppError } from "@application/errors/app-error";

describe("DeletePostController", () => {
  const makeSut = () => {
    const httpValidatorStub = new DeletePostValidatorStub();
    const deletePostUseCaseStub = new DeletePostUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const deletePostUseCaseSpy = vi.spyOn(deletePostUseCaseStub, "execute");
    const sut = new DeletePostController(
      httpValidatorStub,
      deletePostUseCaseStub,
    );
    return { sut, httpValidatorSpy, deletePostUseCaseSpy };
  };

  const dummyRequest = {
    params: {
      id: "valid_post_id",
    },
    user: {
      sub: "authenticated_user_id",
      name: "authenticated_user_name",
      email: "authenticated_user_email",
    },
  };

  it("Should call HttpValidator with correct values", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(httpValidatorSpy).toHaveBeenCalledWith(dummyRequest);
  });

  it("Should call DeletePost use case with correct values", async () => {
    const { sut, deletePostUseCaseSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(deletePostUseCaseSpy).toHaveBeenCalledWith({
      post_id: "valid_post_id",
      user_id: "authenticated_user_id",
    });
  });

  it("Should return 400 if HttpValidator returns a MISSING_PARAM error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("MISSING_PARAM", "post_id");
    });
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Missing Param: post_id");
  });

  it("Should return 204 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(204);
    expect(httpResponse.body).toEqual({});
  });
});
