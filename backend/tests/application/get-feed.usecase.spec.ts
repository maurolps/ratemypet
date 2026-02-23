import { GetFeedUseCase } from "@application/usecases/get-feed.usecase";
import { describe, expect, it, vi } from "vitest";
import { FIXED_DATE } from "../config/constants";
import { GetFeedQueryStub } from "./doubles/get-feed.query.stub";

describe("GetFeedUseCase", () => {
  const makeSut = () => {
    const getFeedQueryStub = new GetFeedQueryStub();
    const getFeedQuerySpy = vi.spyOn(getFeedQueryStub, "getFeed");
    const sut = new GetFeedUseCase(getFeedQueryStub);

    return {
      sut,
      getFeedQuerySpy,
    };
  };

  const getFeedDTO = {
    viewer_id: "valid_viewer_id",
    limit: 2,
    cursor: {
      created_at: FIXED_DATE,
      id: "valid_cursor_id",
    },
  };

  const fakeItem = (overrides = {}) => ({
    id: "valid_post_id",
    caption: "valid_caption",
    image_url: "valid_image_url.png",
    pet: {
      id: "valid_pet_id",
      name: "valid_pet_name",
      type: "dog" as "dog" | "cat",
    },
    author: {
      id: "valid_author_id",
      name: "valid_author_name",
    },
    likes_count: 2,
    comments_count: 1,
    viewer_has_liked: true,
    status: "PUBLISHED" as "PUBLISHED",
    created_at: FIXED_DATE,
    ...overrides,
  });

  it("Should call GetFeedQuery.getFeed with correct values", async () => {
    const { sut, getFeedQuerySpy } = makeSut();
    await sut.execute(getFeedDTO);

    expect(getFeedQuerySpy).toHaveBeenCalledWith({
      viewer_id: "valid_viewer_id",
      limit: 3,
      cursor: {
        created_at: FIXED_DATE,
        id: "valid_cursor_id",
      },
    });
  });

  it("Should return GetFeedResult without pagination cursor when there are no additional items", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(getFeedDTO);

    expect(result).toEqual({
      items: [fakeItem()],
      has_more: false,
      next_cursor: null,
    });
  });

  it("Should return paginated items and next_cursor when there are additional items", async () => {
    const { sut, getFeedQuerySpy } = makeSut();
    const items = [
      fakeItem({ created_at: new Date(0), id: "post_1" }),
      fakeItem({ created_at: new Date(1), id: "post_2" }),
      fakeItem({ created_at: new Date(2), id: "post_3" }),
    ];

    getFeedQuerySpy.mockResolvedValueOnce(items);

    const result = await sut.execute(getFeedDTO);

    expect(result).toEqual({
      items: [items[0], items[1]],
      has_more: true,
      next_cursor: `${new Date(1).toISOString()}|post_2`,
    });
  });

  it("Should rethrow if GetFeedQuery throws an unexpected error", async () => {
    const { sut, getFeedQuerySpy } = makeSut();
    getFeedQuerySpy.mockRejectedValueOnce(new Error("Unexpected error"));

    const promise = sut.execute(getFeedDTO);

    await expect(promise).rejects.toThrow(new Error("Unexpected error"));
  });
});
