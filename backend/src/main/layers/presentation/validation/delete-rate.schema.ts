import { z } from "zod";

export const deleteRateSchema = z
  .object({
    params: z.object(
      {
        id: z.string("MISSING_PARAM").trim().uuid("INVALID_PARAM"),
      },
      { error: "MISSING_PARAM" },
    ),
    user: z.object(
      {
        sub: z.string("MISSING_PARAM").trim().uuid("INVALID_PARAM"),
      },
      { error: "MISSING_PARAM" },
    ),
  })
  .transform(({ params, user }) => {
    return {
      petId: params.id,
      userId: user.sub,
    };
  });
