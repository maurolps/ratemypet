import { z } from "zod";

export const getMeSchema = z
  .object({
    user: z.object(
      {
        sub: z.string("MISSING_PARAM").trim().uuid("INVALID_PARAM"),
      },
      { error: "MISSING_PARAM" },
    ),
  })
  .transform(({ user }) => ({
    user_id: user.sub,
  }));
