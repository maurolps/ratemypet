import { describe, expect, it, vi } from "vitest";
import { UnlikePostController } from "@presentation/controllers/unlike-post.controller";
import { UnlikePostValidatorStub } from "./doubles/unlike-post.validator.stub";
import { UnlikePostUseCaseStub } from "./doubles/unlike-post.usecase.stub";
import { AppError } from "@application/errors/app-error";

describe("UnlikePostController", () => {
  const makeSut = () => {
    const httpValidatorStub = new UnlikePostValidatorStub();
    const unlikePostUseCaseStub = new UnlikePostUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const unlikePostUseCaseSpy = vi.spyOn(unlikePostUseCaseStub, "execute");
    const sut = new UnlikePostController(
      httpValidatorStub,
      unlikePostUseCaseStub,
    );
    return { sut, httpValidatorSpy, unlikePostUseCaseSpy };
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

  it("Should call UnlikePost use case with correct values", async () => {
    const { sut, unlikePostUseCaseSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(unlikePostUseCaseSpy).toHaveBeenCalledWith({
      post_id: "valid_post_id",
      user_id: "authenticated_user_id",
    });
  });

  it("Should return 200 with postId and likes_count on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
      post_id: "valid_post_id",
      likes_count: 0,
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

  it("Should return 400 if HttpValidator returns an INVALID_PARAM error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("INVALID_PARAM", "post_id");
    });
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Invalid Param: post_id");
  });

  it("Should return 404 if post does not exist", async () => {
    const { sut, unlikePostUseCaseSpy } = makeSut();
    unlikePostUseCaseSpy.mockRejectedValueOnce(
      new AppError("NOT_FOUND", "Post"),
    );
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(404);
    expect(httpResponse.body.message).toEqual("Not Found: Post");
  });

  it("Should rethrow if HttpValidator throws an unexpected error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new Error("unexpected_error");
    });
    await expect(sut.handle(dummyRequest)).rejects.toThrow(Error);
  });

  it("Should rethrow if UnlikePost use case throws an unexpected error", async () => {
    const { sut, unlikePostUseCaseSpy } = makeSut();
    unlikePostUseCaseSpy.mockRejectedValueOnce(new Error("unexpected_error"));
    await expect(sut.handle(dummyRequest)).rejects.toThrow(Error);
  });
});
