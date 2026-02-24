import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { GetFeedController } from "@presentation/controllers/get-feed.controller";
import { FIXED_DATE } from "../config/constants";
import { GetFeedUseCaseStub } from "./doubles/get-feed.usecase.stub";
import { GetFeedValidatorStub } from "./doubles/get-feed.validator.stub";

describe("GetFeedController", () => {
  const makeSut = () => {
    const httpValidatorStub = new GetFeedValidatorStub();
    const getFeedUseCaseStub = new GetFeedUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const getFeedUseCaseSpy = vi.spyOn(getFeedUseCaseStub, "execute");
    const sut = new GetFeedController(httpValidatorStub, getFeedUseCaseStub);

    return { sut, httpValidatorSpy, getFeedUseCaseSpy };
  };

  const dummyRequest = {
    query: {
      limit: "20",
      cursor: `${FIXED_DATE.toISOString()}|valid_cursor_id`,
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

  it("Should call GetFeed use case with correct values", async () => {
    const { sut, getFeedUseCaseSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(getFeedUseCaseSpy).toHaveBeenCalledWith({
      viewer_id: "valid_viewer_id",
      limit: 20,
      cursor: {
        created_at: FIXED_DATE,
        id: "valid_cursor_id",
      },
    });
  });

  it("Should return 200 with feed data on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
      items: [
        {
          id: "valid_post_id",
          caption: "valid_caption",
          image_url: "valid_image_url.png",
          pet: {
            id: "valid_pet_id",
            name: "valid_pet_name",
            type: "dog",
          },
          author: {
            id: "valid_author_id",
            name: "valid_author_name",
          },
          likes_count: 2,
          comments_count: 1,
          viewer_has_liked: true,
          status: "PUBLISHED",
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
