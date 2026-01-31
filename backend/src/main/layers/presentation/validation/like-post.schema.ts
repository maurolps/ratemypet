import { z } from "zod";

export const likePostSchema = z
  .object({
    body: z.object(
      {
        post_id: z.string("MISSING_PARAM").trim().min(1, "INVALID_PARAM"),
      },
      { error: "MISSING_BODY" },
    ),
    user: z.object(
      {
        sub: z.string("MISSING_PARAM"),
      },
      { error: "MISSING_PARAM" },
    ),
  })
  .transform(({ body, user }) => {
    return {
      post_id: body.post_id,
      user_id: user.sub,
    };
  });
