import { z } from "zod";

export const deleteCommentSchema = z
  .object({
    params: z.object(
      {
        id: z.string("MISSING_PARAM").trim().uuid("INVALID_PARAM"),
        commentId: z.string("MISSING_PARAM").trim().uuid("INVALID_PARAM"),
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
  .transform(({ params, user }) => {
    return {
      post_id: params.id,
      comment_id: params.commentId,
      user_id: user.sub,
    };
  });
