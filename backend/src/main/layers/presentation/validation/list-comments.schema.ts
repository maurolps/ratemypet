import { z } from "zod";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const uuidSchema = z.string().uuid("INVALID_PARAM");

const cursorSchema = z
  .string("INVALID_PARAM")
  .trim()
  .refine((cursor) => {
    const cursorParts = cursor.split("|");
    if (cursorParts.length !== 2) {
      return false;
    }

    const [createdAt, id] = cursorParts;
    return (
      !Number.isNaN(new Date(createdAt).getTime()) &&
      uuidSchema.safeParse(id).success
    );
  }, "INVALID_PARAM");

const limitSchema = z.coerce
  .number("INVALID_PARAM")
  .int("INVALID_PARAM")
  .min(1, "INVALID_PARAM")
  .max(MAX_LIMIT, "INVALID_PARAM");

export const listCommentsSchema = z
  .object({
    params: z.object(
      {
        id: z.string("MISSING_PARAM").trim().uuid("INVALID_PARAM"),
      },
      { error: "MISSING_PARAM" },
    ),
    query: z
      .object({
        cursor: cursorSchema.optional(),
        limit: limitSchema.optional(),
      })
      .optional(),
  })
  .transform(({ params, query }) => {
    const cursorParts = query?.cursor?.split("|");
    const cursor =
      cursorParts && cursorParts.length === 2
        ? {
            created_at: new Date(cursorParts[0]),
            id: cursorParts[1],
          }
        : undefined;

    return {
      post_id: params.id,
      cursor,
      limit: query?.limit ?? DEFAULT_LIMIT,
    };
  });
