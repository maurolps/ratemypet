import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object(
    {
      name: z.string("MISSING_PARAM"),
      email: z.string("MISSING_PARAM").email("INVALID_PARAM"),
      password: z.string("MISSING_PARAM").min(6, "WEAK_PASSWORD"),
    },
    { error: "MISSING_BODY" },
  ),
});
