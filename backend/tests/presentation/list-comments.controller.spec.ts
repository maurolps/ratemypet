import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { ListCommentsController } from "@presentation/controllers/list-comments.controller";
import { FIXED_DATE } from "../config/constants";
import { ListCommentsUseCaseStub } from "./doubles/list-comments.usecase.stub";
import { ListCommentsValidatorStub } from "./doubles/list-comments.validator.stub";

describe("ListCommentsController", () => {
  const makeSut = () => {
    const httpValidatorStub = new ListCommentsValidatorStub();
    const listCommentsUseCaseStub = new ListCommentsUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const listCommentsUseCaseSpy = vi.spyOn(listCommentsUseCaseStub, "execute");
    const sut = new ListCommentsController(
      httpValidatorStub,
      listCommentsUseCaseStub,
    );

    return { sut, httpValidatorSpy, listCommentsUseCaseSpy };
  };

  const dummyRequest = {
    params: {
      id: "valid_post_id",
    },
    query: {
      limit: "20",
      cursor: `${FIXED_DATE.toISOString()}|valid_cursor_id`,
    },
  };

  it("Should call HttpValidator with correct values", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(httpValidatorSpy).toHaveBeenCalledWith(dummyRequest);
  });

  it("Should call ListComments use case with correct values", async () => {
    const { sut, listCommentsUseCaseSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(listCommentsUseCaseSpy).toHaveBeenCalledWith({
      post_id: "valid_post_id",
      limit: 20,
      cursor: {
        created_at: FIXED_DATE,
        id: "valid_cursor_id",
      },
    });
  });

  it("Should return 200 with comments data on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
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

  it("Should return 400 if HttpValidator returns an INVALID_PARAM error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("INVALID_PARAM", "cursor");
    });
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Invalid Param: cursor");
  });

  it("Should rethrow if HttpValidator throws an unexpected error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new Error("unexpected_error");
    });
    await expect(sut.handle(dummyRequest)).rejects.toThrow(Error);
  });
});
