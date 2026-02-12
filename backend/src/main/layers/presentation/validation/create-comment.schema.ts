import { z } from "zod";

const CONTENT_MAX_LENGTH = 500;

export const createCommentSchema = z
  .object({
    params: z.object(
      {
        id: z.string("MISSING_PARAM").trim().uuid("INVALID_PARAM"),
      },
      { error: "MISSING_PARAM" },
    ),
    body: z.object(
      {
        content: z
          .string("MISSING_PARAM")
          .trim()
          .min(1, "INVALID_PARAM")
          .max(CONTENT_MAX_LENGTH, "INVALID_PARAM"),
      },
      { error: "MISSING_BODY" },
    ),
    headers: z.object(
      {
        idempotency_key: z.string("MISSING_PARAM").trim().uuid("INVALID_PARAM"),
      },
      { error: "MISSING_PARAM" },
    ),
    user: z.object(
      {
        sub: z.string("MISSING_PARAM"),
      },
      { error: "MISSING_PARAM" },
    ),
  })
  .transform(({ params, body, user, headers }) => {
    return {
      post_id: params.id,
      author_id: user.sub,
      content: body.content,
      idempotency_key: headers.idempotency_key,
    };
  });
