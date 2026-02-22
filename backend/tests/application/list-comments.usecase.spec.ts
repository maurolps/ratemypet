import { AppError } from "@application/errors/app-error";
import { ListCommentsUseCase } from "@application/usecases/list-comments.usecase";
import { describe, expect, it, vi } from "vitest";
import { FIXED_DATE } from "../config/constants";
import { GetCommentsQueryStub } from "./doubles/get-comments.query.stub";
import { PostExistsQueryStub } from "./doubles/post-exists.query.stub";

describe("ListCommentsUseCase", () => {
  const makeSut = () => {
    const postExistsQueryStub = new PostExistsQueryStub();
    const postExistsQueryExistsByIdSpy = vi.spyOn(
      postExistsQueryStub,
      "existsById",
    );
    const getCommentsQueryStub = new GetCommentsQueryStub();
    const findCommentsByPostIdSpy = vi.spyOn(
      getCommentsQueryStub,
      "findCommentsByPostId",
    );
    const sut = new ListCommentsUseCase(
      postExistsQueryStub,
      getCommentsQueryStub,
    );

    return {
      sut,
      postExistsQueryExistsByIdSpy,
      findCommentsByPostIdSpy,
    };
  };

  const listCommentsDTO = {
    post_id: "valid_post_id",
    limit: 2,
    cursor: {
      created_at: FIXED_DATE,
      id: "valid_cursor_id",
    },
  };

  it("Should call PostExistsQuery.existsById with correct values", async () => {
    const { sut, postExistsQueryExistsByIdSpy } = makeSut();
    await sut.execute(listCommentsDTO);

    expect(postExistsQueryExistsByIdSpy).toHaveBeenCalledWith("valid_post_id");
  });

  it("Should throw NOT_FOUND when post does not exist", async () => {
    const { sut, postExistsQueryExistsByIdSpy } = makeSut();
    postExistsQueryExistsByIdSpy.mockResolvedValueOnce(false);

    const promise = sut.execute(listCommentsDTO);

    await expect(promise).rejects.toThrow(
      new AppError("NOT_FOUND", "The specified post does not exist."),
    );
  });

  it("Should call GetCommentsQuery.findCommentsByPostId with correct values", async () => {
    const { sut, findCommentsByPostIdSpy } = makeSut();
    await sut.execute(listCommentsDTO);

    expect(findCommentsByPostIdSpy).toHaveBeenCalledWith({
      post_id: "valid_post_id",
      limit: 3,
      cursor: {
        created_at: FIXED_DATE,
        id: "valid_cursor_id",
      },
    });
  });

  it("Should return ListCommentsResult without pagination cursor when there are no additional comments", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(listCommentsDTO);

    expect(result).toEqual({
      items: [
        {
          id: "valid_comment_id",
          post_id: "valid_post_id",
          author_id: "valid_author_id",
          author_name: "valid_author_name",
          content: "valid_comment_content",
          created_at: FIXED_DATE,
        },
      ],
      has_more: false,
      next_cursor: null,
    });
  });

  it("Should return paginated comments and next_cursor when there are additional comments", async () => {
    const { sut, findCommentsByPostIdSpy } = makeSut();
    const firstCommentDate = new Date(0);
    const secondCommentDate = new Date(1);
    const thirdCommentDate = new Date(2);

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

    const result = await sut.execute(listCommentsDTO);

    expect(result.items).toEqual([
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
    expect(result).toEqual({
      items: [
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
      ],
      has_more: true,
      next_cursor: "1970-01-01T00:00:00.001Z|comment_2",
    });
  });

  it("Should rethrow if GetCommentsQuery throws an unexpected error", async () => {
    const { sut, findCommentsByPostIdSpy } = makeSut();
    findCommentsByPostIdSpy.mockRejectedValueOnce(
      new Error("Unexpected error"),
    );

    const promise = sut.execute(listCommentsDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });
});
