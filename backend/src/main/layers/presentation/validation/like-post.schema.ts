import { z } from "zod";

export const likePostSchema = z
  .object({
    params: z.object(
      {
        id: z.string("MISSING_PARAM").trim().min(1, "INVALID_PARAM"),
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
      user_id: user.sub,
    };
  });
