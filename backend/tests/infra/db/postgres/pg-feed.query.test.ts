import { describe, expect, it } from "vitest";
import { PgFeedQuery } from "@infra/db/postgres/queries/pg-feed.query";
import { insertFeedPost } from "./helpers/fake-feed-post";

describe("PgFeedQuery", () => {
  const sut = new PgFeedQuery();

  describe("getFeed", () => {
    it("Should filter feed items by cursor using created_at and id tie-breaker", async () => {
      const olderDate = new Date(1);
      const cursorDate = new Date(2);
      const newestDate = new Date(3);

      await insertFeedPost({
        id: "00000000-0000-0000-0000-000000000001",
        caption: "newest_post",
        status: "PUBLISHED",
        likes_count: 0,
        comments_count: 0,
        created_at: newestDate,
      });
      await insertFeedPost({
        id: "00000000-0000-0000-0000-000000000002",
        caption: "same_cursor_timestamp_smaller_id",
        status: "PUBLISHED",
        likes_count: 0,
        comments_count: 0,
        created_at: cursorDate,
      });
      await insertFeedPost({
        id: "00000000-0000-0000-0000-000000000003",
        caption: "cursor_post",
        status: "PUBLISHED",
        likes_count: 0,
        comments_count: 0,
        created_at: cursorDate,
      });
      await insertFeedPost({
        id: "00000000-0000-0000-0000-000000000004",
        caption: "older_post",
        status: "PUBLISHED",
        likes_count: 0,
        comments_count: 0,
        created_at: olderDate,
      });

      const result = await sut.getFeed({
        limit: 2,
        cursor: {
          created_at: cursorDate,
          id: "00000000-0000-0000-0000-000000000003",
        },
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("00000000-0000-0000-0000-000000000002");
      expect(result[0].caption).toBe("same_cursor_timestamp_smaller_id");
      expect(result[1].id).toBe("00000000-0000-0000-0000-000000000004");
      expect(result[1].caption).toBe("older_post");
    });

    it("Should return feed when no pagination parameters are provided", async () => {
      await insertFeedPost({
        id: crypto.randomUUID(),
        caption: "any_post_caption",
        status: "PUBLISHED",
        likes_count: 0,
        comments_count: 0,
        created_at: new Date(0),
      });

      const result = await sut.getFeed({ limit: 1 });
      expect(result).toHaveLength(1);
      expect(result[0].caption).toBeTruthy();
      expect(result[0].status).toBe("PUBLISHED");
      expect(result[0].likes_count).toBe(0);
      expect(result[0].comments_count).toBe(0);
      expect(result[0].pet.ratings_count).toBe(0);
    });
  });
});
