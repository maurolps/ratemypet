import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { DeleteCommentController } from "@presentation/controllers/delete-comment.controller";
import { DeleteCommentValidatorStub } from "./doubles/delete-comment.validator.stub";
import { DeleteCommentUseCaseStub } from "./doubles/delete-comment.usecase.stub";

describe("DeleteCommentController", () => {
  const makeSut = () => {
    const httpValidatorStub = new DeleteCommentValidatorStub();
    const deleteCommentUseCaseStub = new DeleteCommentUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const deleteCommentUseCaseSpy = vi.spyOn(
      deleteCommentUseCaseStub,
      "execute",
    );
    const sut = new DeleteCommentController(
      httpValidatorStub,
      deleteCommentUseCaseStub,
    );
    return { sut, httpValidatorSpy, deleteCommentUseCaseSpy };
  };

  const dummyRequest = {
    params: {
      id: "valid_post_id",
      commentId: "valid_comment_id",
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

  it("Should call DeleteComment use case with correct values", async () => {
    const { sut, deleteCommentUseCaseSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(deleteCommentUseCaseSpy).toHaveBeenCalledWith({
      post_id: "valid_post_id",
      comment_id: "valid_comment_id",
      user_id: "authenticated_user_id",
    });
  });

  it("Should return 400 if HttpValidator returns a MISSING_PARAM error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("MISSING_PARAM", "commentId");
    });
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Missing Param: commentId");
  });

  it("Should return 403 if use case throws FORBIDDEN", async () => {
    const { sut, deleteCommentUseCaseSpy } = makeSut();
    deleteCommentUseCaseSpy.mockRejectedValueOnce(
      new AppError("FORBIDDEN", "No permission"),
    );
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(403);
    expect(httpResponse.body.message).toEqual("Forbidden: No permission");
  });

  it("Should return 204 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(204);
    expect(httpResponse.body).toEqual({});
  });
});
