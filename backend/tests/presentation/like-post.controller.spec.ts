import { describe, expect, it, vi } from "vitest";
import { LikePostController } from "@presentation/controllers/like-post.controller";
import { LikePostValidatorStub } from "./doubles/like-post.validator.stub";
import { LikePostUseCaseStub } from "./doubles/like-post.usecase.stub";
import { AppError } from "@application/errors/app-error";
import { FIXED_DATE } from "../config/constants";

describe("LikePostController", () => {
  const makeSut = () => {
    const httpValidatorStub = new LikePostValidatorStub();
    const likePostUseCaseStub = new LikePostUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const likePostUseCaseSpy = vi.spyOn(likePostUseCaseStub, "execute");
    const sut = new LikePostController(httpValidatorStub, likePostUseCaseStub);
    return { sut, httpValidatorSpy, likePostUseCaseSpy };
  };

  const dummyRequest = {
    body: {
      post_id: "valid_post_id",
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

  it("Should call LikePost use case with correct values", async () => {
    const { sut, likePostUseCaseSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(likePostUseCaseSpy).toHaveBeenCalledWith({
      post_id: "valid_post_id",
      user_id: "valid_user_id",
    });
  });

  it("Should return 200 with like data on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
      like: {
        post_id: "valid_post_id",
        user_id: "valid_user_id",
        created_at: FIXED_DATE,
      },
      likes_count: 1,
    });
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
});
