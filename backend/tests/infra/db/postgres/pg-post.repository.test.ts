import { it, describe, expect, beforeAll, vi } from "vitest";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { Post } from "@domain/entities/post";
import { insertFakeUser } from "./helpers/fake-user";
import { insertFakePet } from "./helpers/fake-pet";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";

describe("PgPostRepository", () => {
  const postDTO = {
    pet_id: "",
    author_id: "",
    default_caption: "This is a default caption for the pet",
    caption: "This is a valid caption for the post",
  };

  beforeAll(async () => {
    const user = await insertFakeUser("fake_post_owner@mail.com");
    const pet = await insertFakePet(user.id);
    postDTO.author_id = user.id;
    postDTO.pet_id = pet.id;
  });

  describe("save", () => {
    it("Should persist and return a Post on success", async () => {
      const sut = new PgPostRepository();
      const post = await sut.save(Post.create(postDTO));
      const state = post.toState;
      expect(state.id).toBeTruthy();
      expect(state.pet_id).toEqual(postDTO.pet_id);
      expect(state.author_id).toEqual(postDTO.author_id);
      expect(state.caption).toEqual(postDTO.caption);
      expect(state.status).toEqual("PUBLISHED");
      expect(state.created_at).toBeInstanceOf(Date);
    });

    it("Should use a transaction if provided", async () => {
      const sut = new PgPostRepository();
      const query = vi.fn().mockResolvedValue({ rows: [] });
      const fakePool = {};
      const transaction = {
        query,
      };

      const getInstanceSpy = vi
        .spyOn(PgPool, "getInstance")
        .mockReturnValue(fakePool as unknown as PgPool);
      await sut.save(Post.create(postDTO), transaction);

      expect(transaction.query).toHaveBeenCalled();
      getInstanceSpy.mockReset();
    });
  });

  describe("findById", () => {
    it("Should return a Post when found", async () => {
      const sut = new PgPostRepository();
      const savedPost = await sut.save(Post.create(postDTO));
      const foundPost = await sut.findById(savedPost.toState.id ?? "");
      expect(foundPost).not.toBeNull();
      expect(foundPost?.toState.id).toEqual(savedPost.toState.id);
      expect(foundPost?.toState.pet_id).toEqual(postDTO.pet_id);
      expect(foundPost?.toState.author_id).toEqual(postDTO.author_id);
    });

    it("Should return null when post is not found", async () => {
      const sut = new PgPostRepository();
      const nonExistentId = crypto.randomUUID();
      const foundPost = await sut.findById(nonExistentId);
      expect(foundPost).toBeNull();
    });
  });

  describe("updateLikesCount", () => {
    it("Should update likes_count and return updated Post", async () => {
      const sut = new PgPostRepository();
      const savedPost = await sut.save(Post.create(postDTO));
      const updatedPost = await sut.updateLikesCount(savedPost.like());
      const state = updatedPost.toState;
      expect(state.id).toEqual(savedPost.toState.id);
      expect(state.likes_count).toBe(1);
      expect(state.comments_count).toBe(savedPost.toState.comments_count);
    });
  });
});
