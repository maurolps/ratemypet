import { z } from "zod";

export const loginSchema = z
  .object({
    body: z.object(
      {
        email: z
          .string("MISSING_PARAM")
          .trim()
          .email("INVALID_PARAM") // unauthorized
          .toLowerCase(),
        password: z.string("MISSING_PARAM"),
      },
      { error: "MISSING_BODY" },
    ),
  })
  .transform((data) => data.body);
