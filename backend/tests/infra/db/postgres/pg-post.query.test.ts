import { describe, expect, it } from "vitest";
import { Post } from "@domain/entities/post";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { PgPostQuery } from "@infra/db/postgres/queries/pg-post.query";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { PgLikeRepository } from "@infra/db/postgres/pg-like.repository";
import { insertFakePet } from "./helpers/fake-pet";
import { insertFakeUser } from "./helpers/fake-user";

type InsertCommentDTO = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  idempotency_key: string;
  created_at: Date;
};

describe("PgPostQuery", () => {
  const pool = PgPool.getInstance();
  const postRepository = new PgPostRepository();
  const likeRepository = new PgLikeRepository();
  const sut = new PgPostQuery();

  const generateFakeEmail = (prefix: string): string =>
    `${prefix}_${Date.now()}_${crypto.randomUUID()}@mail.com`;

  const insertComment = async (comment: InsertCommentDTO): Promise<void> => {
    await pool.query(
      `
      INSERT INTO comments (id, post_id, author_id, content, idempotency_key, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        comment.id,
        comment.post_id,
        comment.author_id,
        comment.content,
        comment.idempotency_key,
        comment.created_at,
      ],
    );
  };

  const insertFakePost = async (): Promise<{
    post_id: string;
    owner_id: string;
  }> => {
    const owner = await insertFakeUser(
      generateFakeEmail("pg_post_query_owner"),
    );
    const pet = await insertFakePet(owner.id);
    const post = await postRepository.save(
      Post.create({
        pet_id: pet.id,
        author_id: owner.id,
        default_caption: "Default caption",
        caption: "Post caption",
      }),
    );

    return {
      post_id: post.toState.id ?? "",
      owner_id: owner.id,
    };
  };

  describe("findPostDetailsById", () => {
    it("Should return null when post does not exist", async () => {
      const result = await sut.findPostDetailsById(crypto.randomUUID());

      expect(result).toBeNull();
    });

    it("Should return post details with viewer_has_liked false when no like exists", async () => {
      const { post_id, owner_id } = await insertFakePost();

      const result = await sut.findPostDetailsById(post_id, owner_id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(post_id);
      expect(result?.author_id).toBe(owner_id);
      expect(result?.caption).toBe("Post caption");
      expect(result?.status).toBe("PUBLISHED");
      expect(result?.likes_count).toBe(0);
      expect(result?.comments_count).toBe(0);
      expect(result?.created_at).toBeInstanceOf(Date);
      expect(result?.viewer_has_liked).toBe(false);
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
      expect(result?.viewer_has_liked).toBe(true);
    });
  });

  describe("findCommentsByPostId", () => {
    it("Should return comments ordered by created_at DESC and id DESC with the requested limit", async () => {
      const { post_id, owner_id } = await insertFakePost();
      const commentDateA = new Date("2026-01-01T00:00:00.000Z");
      const commentDateB = new Date("2026-01-02T00:00:00.000Z");
      const commentDateC = new Date("2026-01-03T00:00:00.000Z");

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
      const newestDate = new Date("2026-02-03T00:00:00.000Z");
      const cursorDate = new Date("2026-02-02T00:00:00.000Z");
      const olderDate = new Date("2026-02-01T00:00:00.000Z");

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
