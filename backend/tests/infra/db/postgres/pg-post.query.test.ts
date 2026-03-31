import { describe, expect, it } from "vitest";
import { PgPostQuery } from "@infra/db/postgres/queries/pg-post.query";
import { PgLikeRepository } from "@infra/db/postgres/pg-like.repository";
import { PgRateRepository } from "@infra/db/postgres/pg-rate.repository";
import { insertComment } from "./helpers/fake-comment";
import { generateFakeEmail } from "./helpers/fake-email";
import { insertFakePost } from "./helpers/fake-post";
import { insertFakeUser } from "./helpers/fake-user";

describe("PgPostQuery", () => {
  const likeRepository = new PgLikeRepository();
  const rateRepository = new PgRateRepository();
  const sut = new PgPostQuery();

  describe("findPostDetailsById", () => {
    it("Should return null when post does not exist", async () => {
      const result = await sut.findPostDetailsById(crypto.randomUUID());

      expect(result).toBeNull();
    });

    it("Should return post details with viewer_has_liked false when no like exists", async () => {
      const { post_id, owner_id } = await insertFakePost();

      const result = await sut.findPostDetailsById(post_id, owner_id);

      expect(result).not.toBeNull();
      expect(result?.post.id).toBe(post_id);
      expect(result?.post.author_id).toBe(owner_id);
      expect(result?.post.caption).toBe("Post caption");
      expect(result?.post.status).toBe("PUBLISHED");
      expect(result?.post.likes_count).toBe(0);
      expect(result?.post.comments_count).toBe(0);
      expect(result?.post.created_at).toBeInstanceOf(Date);
      expect(result?.post.viewer_has_liked).toBe(false);
      expect(result?.ratings.total_count).toEqual(0);
    });

    it("Should return viewer_has_liked true when the viewer liked the post", async () => {
      const { post_id } = await insertFakePost();
      const viewer = await insertFakeUser(
        generateFakeEmail("pg_post_query_viewer"),
      );
      await likeRepository.save({
        post_id,
        user_id: viewer.id,
      });

      const result = await sut.findPostDetailsById(post_id, viewer.id);

      expect(result).not.toBeNull();
      expect(result?.post.viewer_has_liked).toBe(true);
    });

    it("Should return ratings summary grouped by rate", async () => {
      const { post_id, pet_id } = await insertFakePost();
      const raterA = await insertFakeUser(
        generateFakeEmail("pg_post_query_rater_a"),
      );
      const raterB = await insertFakeUser(
        generateFakeEmail("pg_post_query_rater_b"),
      );

      await rateRepository.upsert({
        petId: pet_id,
        userId: raterA.id,
        rate: "cute",
      });
      await rateRepository.upsert({
        petId: pet_id,
        userId: raterB.id,
        rate: "funny",
      });

      const result = await sut.findPostDetailsById(post_id);

      expect(result?.ratings).toEqual({
        total_count: 2,
        by_rate: {
          cute: 1,
          funny: 1,
          majestic: 0,
          chaos: 0,
          smart: 0,
          sleepy: 0,
        },
      });
    });
  });

  describe("existsById", () => {
    it("Should return false when post does not exist", async () => {
      const result = await sut.existsById(crypto.randomUUID());

      expect(result).toBe(false);
    });

    it("Should return true when post exists", async () => {
      const { post_id } = await insertFakePost();

      const result = await sut.existsById(post_id);

      expect(result).toBe(true);
    });
  });

  describe("findCommentsByPostId", () => {
    it("Should return comments ordered by created_at DESC and id DESC with the requested limit", async () => {
      const { post_id, owner_id } = await insertFakePost();
      const commentDateA = new Date(0);
      const commentDateB = new Date(1);
      const commentDateC = new Date(2);

      await insertComment({
        id: "00000000-0000-0000-0000-000000000001",
        post_id,
        author_id: owner_id,
        content: "older_comment",
        idempotency_key: "00000000-0000-0000-0000-000000000011",
        created_at: commentDateA,
      });
      await insertComment({
        id: "00000000-0000-0000-0000-000000000002",
        post_id,
        author_id: owner_id,
        content: "middle_comment",
        idempotency_key: "00000000-0000-0000-0000-000000000022",
        created_at: commentDateB,
      });
      await insertComment({
        id: "00000000-0000-0000-0000-000000000003",
        post_id,
        author_id: owner_id,
        content: "newer_comment",
        idempotency_key: "00000000-0000-0000-0000-000000000033",
        created_at: commentDateC,
      });

      const result = await sut.findCommentsByPostId({
        post_id,
        limit: 2,
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("00000000-0000-0000-0000-000000000003");
      expect(result[0].content).toBe("newer_comment");
      expect(result[0].author_name).toBe("any_name");
      expect(result[0].created_at).toEqual(commentDateC);
      expect(result[1].id).toBe("00000000-0000-0000-0000-000000000002");
      expect(result[1].content).toBe("middle_comment");
      expect(result[1].created_at).toEqual(commentDateB);
    });

    it("Should filter comments by cursor using created_at and id tie-breaker", async () => {
      const { post_id, owner_id } = await insertFakePost();
      const newestDate = new Date(2);
      const cursorDate = new Date(1);
      const olderDate = new Date(0);

      await insertComment({
        id: "00000000-0000-0000-0000-0000000000d4",
        post_id,
        author_id: owner_id,
        content: "newest_comment",
        idempotency_key: "00000000-0000-0000-0000-0000000000e4",
        created_at: newestDate,
      });
      await insertComment({
        id: "00000000-0000-0000-0000-0000000000c3",
        post_id,
        author_id: owner_id,
        content: "cursor_comment",
        idempotency_key: "00000000-0000-0000-0000-0000000000f3",
        created_at: cursorDate,
      });
      await insertComment({
        id: "00000000-0000-0000-0000-0000000000b2",
        post_id,
        author_id: owner_id,
        content: "same_timestamp_smaller_id",
        idempotency_key: "00000000-0000-0000-0000-0000000000a2",
        created_at: cursorDate,
      });
      await insertComment({
        id: "00000000-0000-0000-0000-0000000000a1",
        post_id,
        author_id: owner_id,
        content: "older_comment",
        idempotency_key: "00000000-0000-0000-0000-000000000091",
        created_at: olderDate,
      });

      const result = await sut.findCommentsByPostId({
        post_id,
        limit: 10,
        cursor: {
          created_at: cursorDate,
          id: "00000000-0000-0000-0000-0000000000c3",
        },
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("00000000-0000-0000-0000-0000000000b2");
      expect(result[0].content).toBe("same_timestamp_smaller_id");
      expect(result[1].id).toBe("00000000-0000-0000-0000-0000000000a1");
      expect(result[1].content).toBe("older_comment");
    });
  });
});
