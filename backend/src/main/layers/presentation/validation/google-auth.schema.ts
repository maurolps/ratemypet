import { z } from "zod";

export const googleAuthSchema = z
  .object({
    body: z.object(
      {
        id_token: z.string("MISSING_PARAM").trim().min(1, "MISSING_PARAM"),
      },
      { error: "MISSING_BODY" },
    ),
  })
  .transform((data) => data.body);
