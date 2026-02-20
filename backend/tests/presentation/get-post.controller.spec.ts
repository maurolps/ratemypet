import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { GetPostController } from "@presentation/controllers/get-post.controller";
import { GetPostValidatorStub } from "./doubles/get-post.validator.stub";
import { GetPostUseCaseStub } from "./doubles/get-post.usecase.stub";
import { FIXED_DATE } from "../config/constants";

describe("GetPostController", () => {
  const makeSut = () => {
    const httpValidatorStub = new GetPostValidatorStub();
    const getPostUseCaseStub = new GetPostUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const getPostUseCaseSpy = vi.spyOn(getPostUseCaseStub, "execute");
    const sut = new GetPostController(httpValidatorStub, getPostUseCaseStub);
    return { sut, httpValidatorSpy, getPostUseCaseSpy };
  };

  const dummyRequest = {
    params: {
      id: "valid_post_id",
    },
    query: {
      limit: "20",
    },
    user: {
      sub: "valid_viewer_id",
      name: "valid_viewer_name",
      email: "valid_viewer_email@mail.com",
    },
  };

  it("Should call HttpValidator with correct values", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(httpValidatorSpy).toHaveBeenCalledWith(dummyRequest);
  });

  it("Should call GetPost use case with correct values", async () => {
    const { sut, getPostUseCaseSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(getPostUseCaseSpy).toHaveBeenCalledWith({
      post_id: "valid_post_id",
      viewer_id: "valid_viewer_id",
      limit: 20,
    });
  });

  it("Should return 200 with post data on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
      post: {
        id: "valid_post_id",
        pet_id: "valid_pet_id",
        author_id: "valid_author_id",
        caption: "valid_caption",
        status: "PUBLISHED",
        created_at: FIXED_DATE,
        likes_count: 2,
        comments_count: 1,
        viewer_has_liked: true,
      },
      comments: [
        {
          id: "valid_comment_id",
          post_id: "valid_post_id",
          author_id: "valid_comment_author_id",
          author_name: "valid_comment_author_name",
          content: "valid_comment_content",
          created_at: FIXED_DATE,
        },
      ],
      pagination: {
        limit: 20,
        next_cursor: null,
        has_more: false,
      },
    });
  });

  it("Should return 400 if HttpValidator returns a MISSING_PARAM error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("MISSING_PARAM", "id");
    });
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Missing Param: id");
  });

  it("Should return 400 if HttpValidator returns an INVALID_PARAM error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("INVALID_PARAM", "cursor");
    });
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Invalid Param: cursor");
  });

  it("Should return 404 if post does not exist", async () => {
    const { sut, getPostUseCaseSpy } = makeSut();
    getPostUseCaseSpy.mockRejectedValueOnce(new AppError("NOT_FOUND", "Post"));
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

  it("Should rethrow if GetPost use case throws an unexpected error", async () => {
    const { sut, getPostUseCaseSpy } = makeSut();
    getPostUseCaseSpy.mockRejectedValueOnce(new Error("unexpected_error"));
    await expect(sut.handle(dummyRequest)).rejects.toThrow(Error);
  });
});
