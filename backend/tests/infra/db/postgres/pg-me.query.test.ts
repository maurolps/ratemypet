import { describe, expect, it } from "vitest";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { PgMeQuery } from "@infra/db/postgres/queries/pg-me.query";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { Post } from "@domain/entities/post";
import { insertFakePet } from "./helpers/fake-pet";
import { generateFakeEmail } from "./helpers/fake-email";
import { insertFakeUser } from "./helpers/fake-user";

describe("PgMeQuery", () => {
  const sut = new PgMeQuery();
  const pool = PgPool.getInstance();
  const postRepository = new PgPostRepository();

  describe("findByUserId", () => {
    it("Should return null when user does not exist", async () => {
      const result = await sut.findByUserId(crypto.randomUUID());

      expect(result).toBeNull();
    });

    it("Should return profile summary with published-only stats", async () => {
      const picture = "https://valid.picture/me.png";
      const user = await insertFakeUser(
        generateFakeEmail("pg_me_query_owner"),
        picture,
      );
      const pet = await insertFakePet(user.id);

      const publishedPost = await postRepository.save(
        Post.rehydrate({
          pet_id: pet.id,
          author_id: user.id,
          caption: "Published caption",
          status: "PUBLISHED",
          created_at: new Date(),
          likes_count: 12,
          comments_count: 0,
        }),
      );
      await pool.query(
        `
        UPDATE posts
        SET likes_count = 12
        WHERE id = $1
        `,
        [publishedPost.toState.id],
      );

      const rejectedPost = await postRepository.save(
        Post.rehydrate({
          pet_id: pet.id,
          author_id: user.id,
          caption: "Rejected caption",
          status: "REJECTED",
          created_at: new Date(),
          likes_count: 50,
          comments_count: 0,
        }),
      );
      await pool.query(
        `
        UPDATE posts
        SET likes_count = 50
        WHERE id = $1
        `,
        [rejectedPost.toState.id],
      );

      const result = await sut.findByUserId(user.id);

      expect(publishedPost.toState.id).toBeTruthy();
      expect(result).toEqual({
        id: user.id,
        displayName: "any_name",
        email: user.email,
        bio: "Pet lover 🐶",
        createdAt: user.createdAt,
        picture,
        stats: {
          postsCount: 1,
          likesReceived: 12,
        },
      });
    });

    it("Should return zero stats when no published post exists", async () => {
      const user = await insertFakeUser(generateFakeEmail("pg_me_query_empty"));

      const result = await sut.findByUserId(user.id);

      expect(result?.stats).toEqual({
        postsCount: 0,
        likesReceived: 0,
      });
    });
  });

  describe("findByOwnerId", () => {
    it("Should return only active pets ordered by created_at ASC and id ASC", async () => {
      const user = await insertFakeUser(generateFakeEmail("pg_me_query_pets"));
      const olderPet = await insertFakePet(user.id);
      const newerPet = await insertFakePet(user.id);

      await pool.query(
        `
        UPDATE pets
        SET created_at = $2
        WHERE id = $1
        `,
        [olderPet.id, new Date("2025-01-01T00:00:00.000Z")],
      );
      await pool.query(
        `
        UPDATE pets
        SET created_at = $2
        WHERE id = $1
        `,
        [newerPet.id, new Date("2025-01-02T00:00:00.000Z")],
      );
      await pool.query(
        `
        UPDATE pets
        SET deleted_at = NOW()
        WHERE id = $1
        `,
        [newerPet.id],
      );

      const result = await sut.findByOwnerId(user.id);

      expect(result).toEqual([
        {
          id: olderPet.id,
          name: "fake_pet_name",
          type: "dog",
          imageUrl: "https://fake.image.url/pet.png",
        },
      ]);
    });
  });
});
