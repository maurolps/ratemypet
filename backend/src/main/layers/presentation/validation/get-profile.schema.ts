import { z } from "zod";

export const getProfileSchema = z
  .object({
    params: z.object(
      {
        id: z.string("MISSING_PARAM").trim().uuid("INVALID_PARAM"),
      },
      { error: "MISSING_PARAM" },
    ),
  })
  .transform(({ params }) => ({
    user_id: params.id,
  }));
