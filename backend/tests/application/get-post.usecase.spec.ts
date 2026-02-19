import { AppError } from "@application/errors/app-error";
import { GetPostUseCase } from "@application/usecases/get-post.usecase";
import { describe, expect, it, vi } from "vitest";
import { FIXED_DATE } from "../config/constants";
import { GetCommentsQueryStub } from "./doubles/get-comments.query.stub";
import { GetPostQueryStub } from "./doubles/get-post.query.stub";

describe("GetPostUseCase", () => {
  const makeSut = () => {
    const getPostQueryStub = new GetPostQueryStub();
    const findPostDetailsByIdSpy = vi.spyOn(
      getPostQueryStub,
      "findPostDetailsById",
    );
    const getCommentsQueryStub = new GetCommentsQueryStub();
    const findCommentsByPostIdSpy = vi.spyOn(
      getCommentsQueryStub,
      "findCommentsByPostId",
    );
    const sut = new GetPostUseCase(getPostQueryStub, getCommentsQueryStub);

    return {
      sut,
      findPostDetailsByIdSpy,
      findCommentsByPostIdSpy,
    };
  };

  const getPostDTO = {
    post_id: "valid_post_id",
    viewer_id: "valid_viewer_id",
    limit: 2,
    cursor: {
      created_at: FIXED_DATE,
      id: "valid_cursor_id",
    },
  };

  it("Should call GetPostQuery.findPostDetailsById with correct values", async () => {
    const { sut, findPostDetailsByIdSpy } = makeSut();
    await sut.execute(getPostDTO);

    expect(findPostDetailsByIdSpy).toHaveBeenCalledWith(
      "valid_post_id",
      "valid_viewer_id",
    );
  });

  it("Should throw NOT_FOUND when post does not exist", async () => {
    const { sut, findPostDetailsByIdSpy } = makeSut();
    findPostDetailsByIdSpy.mockResolvedValueOnce(null);

    const promise = sut.execute(getPostDTO);

    await expect(promise).rejects.toThrow(
      new AppError("NOT_FOUND", "The specified post does not exist."),
    );
  });

  it("Should call GetCommentsQuery.findCommentsByPostId with correct values", async () => {
    const { sut, findCommentsByPostIdSpy } = makeSut();
    await sut.execute(getPostDTO);

    expect(findCommentsByPostIdSpy).toHaveBeenCalledWith({
      post_id: "valid_post_id",
      limit: 3,
      cursor: {
        created_at: FIXED_DATE,
        id: "valid_cursor_id",
      },
    });
  });

  it("Should return GetPostResult without pagination cursor when there are no additional comments", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(getPostDTO);

    expect(result).toEqual({
      post: {
        id: "valid_post_id",
        pet_id: "valid_pet_id",
        author_id: "valid_author_id",
        caption: "valid_caption",
        status: "PUBLISHED",
        created_at: FIXED_DATE,
        likes_count: 1,
        comments_count: 1,
        viewer_has_liked: true,
      },
      comments: [
        {
          id: "valid_comment_id",
          post_id: "valid_post_id",
          author_id: "valid_author_id",
          author_name: "valid_author_name",
          content: "valid_comment_content",
          created_at: FIXED_DATE,
        },
      ],
      pagination: {
        limit: 2,
        next_cursor: null,
        has_more: false,
      },
    });
  });

  it("Should return paginated comments and next_cursor when there are additional comments", async () => {
    const { sut, findCommentsByPostIdSpy } = makeSut();
    const firstCommentDate = new Date("2025-01-01T00:00:00.000Z");
    const secondCommentDate = new Date("2025-01-02T00:00:00.000Z");
    const thirdCommentDate = new Date("2025-01-03T00:00:00.000Z");

    findCommentsByPostIdSpy.mockResolvedValueOnce([
      {
        id: "comment_1",
        post_id: "valid_post_id",
        author_id: "valid_author_id",
        author_name: "valid_author_name",
        content: "comment_1_content",
        created_at: firstCommentDate,
      },
      {
        id: "comment_2",
        post_id: "valid_post_id",
        author_id: "valid_author_id",
        author_name: "valid_author_name",
        content: "comment_2_content",
        created_at: secondCommentDate,
      },
      {
        id: "comment_3",
        post_id: "valid_post_id",
        author_id: "valid_author_id",
        author_name: "valid_author_name",
        content: "comment_3_content",
        created_at: thirdCommentDate,
      },
    ]);

    const result = await sut.execute(getPostDTO);

    expect(result.comments).toEqual([
      {
        id: "comment_1",
        post_id: "valid_post_id",
        author_id: "valid_author_id",
        author_name: "valid_author_name",
        content: "comment_1_content",
        created_at: firstCommentDate,
      },
      {
        id: "comment_2",
        post_id: "valid_post_id",
        author_id: "valid_author_id",
        author_name: "valid_author_name",
        content: "comment_2_content",
        created_at: secondCommentDate,
      },
    ]);
    expect(result.pagination).toEqual({
      limit: 2,
      next_cursor: "2025-01-02T00:00:00.000Z|comment_2",
      has_more: true,
    });
  });

  it("Should rethrow if GetCommentsQuery throws an unexpected error", async () => {
    const { sut, findCommentsByPostIdSpy } = makeSut();
    findCommentsByPostIdSpy.mockRejectedValueOnce(
      new Error("Unexpected error"),
    );

    const promise = sut.execute(getPostDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });
});
