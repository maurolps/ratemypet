import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { CreateCommentController } from "@presentation/controllers/create-comment.controller";
import { FIXED_DATE } from "../config/constants";
import { CreateCommentUseCaseStub } from "./doubles/create-comment.usecase.stub";
import { CreateCommentValidatorStub } from "./doubles/create-comment.validator.stub";

describe("CreateCommentController", () => {
  const makeSut = () => {
    const httpValidatorStub = new CreateCommentValidatorStub();
    const createCommentUseCaseStub = new CreateCommentUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const createCommentUseCaseSpy = vi.spyOn(
      createCommentUseCaseStub,
      "execute",
    );
    const sut = new CreateCommentController(
      httpValidatorStub,
      createCommentUseCaseStub,
    );

    return { sut, httpValidatorSpy, createCommentUseCaseSpy };
  };

  const dummyRequest = {
    params: {
      id: "valid_post_id",
    },
    body: {
      content: "valid_comment_content",
    },
    headers: {
      idempotency_key: "valid_idempotency_key",
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

  it("Should call CreateComment use case with correct values", async () => {
    const { sut, createCommentUseCaseSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(createCommentUseCaseSpy).toHaveBeenCalledWith({
      post_id: "valid_post_id",
      author_id: "authenticated_user_id",
      content: "valid_comment_content",
      idempotency_key: "valid_idempotency_key",
    });
  });

  it("Should return 200 with comment data on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
      comment: {
        id: "valid_comment_id",
        post_id: "valid_post_id",
        author_id: "authenticated_user_id",
        content: "valid_comment_content",
        idempotency_key: "valid_idempotency_key",
        created_at: FIXED_DATE,
      },
      comments_count: 1,
    });
  });

  it("Should return 400 if HttpValidator returns an error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("INVALID_PARAM", "idempotency_key");
    });

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Invalid Param: idempotency_key");
  });
});
