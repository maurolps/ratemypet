import { it, describe, expect, beforeAll, vi } from "vitest";
import { PgLikeRepository } from "@infra/db/postgres/pg-like.repository";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { Post } from "@domain/entities/post";
import { insertFakeUser } from "./helpers/fake-user";
import { insertFakePet } from "./helpers/fake-pet";

describe("PgLikeRepository", () => {
  const likeDTO = {
    post_id: "",
    user_id: "",
  };

  beforeAll(async () => {
    const user = await insertFakeUser("fake_like_owner@mail.com");
    const pet = await insertFakePet(user.id);
    const postRepository = new PgPostRepository();
    const post = await postRepository.save(
      Post.create({
        pet_id: pet.id,
        author_id: user.id,
        default_caption: "Fake caption",
        caption: "Fake caption",
      }),
    );
    likeDTO.user_id = user.id;
    likeDTO.post_id = post.toState.id ?? "";
  });

  describe("PgLikeRepository", () => {
    it("Should persist and return a Like on success", async () => {
      const sut = new PgLikeRepository();
      const like = await sut.save(likeDTO);
      expect(like.post_id).toEqual(likeDTO.post_id);
      expect(like.user_id).toEqual(likeDTO.user_id);
      expect(like.created_at).toBeInstanceOf(Date);
    });

    it("Should return a Like when it exists", async () => {
      const sut = new PgLikeRepository();
      const like = await sut.exists(likeDTO);
      expect(like).not.toBeNull();
      expect(like?.post_id).toEqual(likeDTO.post_id);
      expect(like?.user_id).toEqual(likeDTO.user_id);
    });

    it("Should return null when like does not exist", async () => {
      const sut = new PgLikeRepository();
      const like = await sut.exists({
        post_id: crypto.randomUUID(),
        user_id: crypto.randomUUID(),
      });
      expect(like).toBeNull();
    });

    it("Should delete an existing like and return true", async () => {
      const sut = new PgLikeRepository();
      const deleteDTO = {
        post_id: likeDTO.post_id,
        user_id: likeDTO.user_id,
      };
      const result = await sut.delete(deleteDTO);
      expect(result).toBe(true);
      const deletedLike = await sut.exists(deleteDTO);
      expect(deletedLike).toBeNull();
    });

    it("Should return false when deleting a non-existent like", async () => {
      const sut = new PgLikeRepository();
      const result = await sut.delete({
        post_id: crypto.randomUUID(),
        user_id: crypto.randomUUID(),
      });
      expect(result).toBe(false);
    });

    it("Should use a transaction when deleting a like", async () => {
      const sut = new PgLikeRepository();
      const query = vi.fn().mockResolvedValue({ rowCount: 1 });
      const transaction = {
        query,
      };

      const result = await sut.delete(likeDTO, transaction);

      expect(transaction.query).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("Should return false when transaction delete returns undefined rowCount", async () => {
      const sut = new PgLikeRepository();
      const transaction = {
        query: vi.fn().mockResolvedValue({ rowCount: undefined }),
      };

      const result = await sut.delete(likeDTO, transaction);

      expect(result).toBe(false);
    });
  });
});
