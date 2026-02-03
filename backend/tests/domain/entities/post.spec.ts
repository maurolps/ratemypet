import { Post } from "@domain/entities/post";
import { describe, expect, it } from "vitest";

describe("Post", () => {
  const postInput = {
    id: "valid_post_id",
    pet_id: "valid_pet_id",
    author_id: "valid_author_id",
    default_caption: "generated_caption",
    caption: "valid_user_caption",
  };

  it("Should create a Post with intial valid state", () => {
    const sut = Post.create(postInput);
    const state = sut.toState;
    expect(state.status).toBe("PUBLISHED");
    expect(state.likes_count).toBe(0);
    expect(state.comments_count).toBe(0);
    expect(state.caption).toBe("valid_user_caption");
  });

  it("Should throw if likes_count is negative", () => {
    const sut = () =>
      Post.create({
        ...postInput,
        likes_count: -1,
      });
    expect(sut).toThrowError("Likes count cannot be negative.");
  });

  it("Should use default_caption when caption is not provided", () => {
    const sut = Post.create({
      ...postInput,
      caption: undefined,
    });
    const state = sut.toState;
    expect(state.caption).toBe("generated_caption");
  });

  it("Should use the user caption when provided", () => {
    const sut = Post.create({
      ...postInput,
      caption: "user_provided_caption",
    });
    const state = sut.toState;
    expect(state.caption).toBe("user_provided_caption");
  });

  it("Should throw if comments_count is negative", () => {
    const sut = () =>
      Post.create({
        ...postInput,
        comments_count: -1,
      });
    expect(sut).toThrowError("Comments count cannot be negative.");
  });
});
