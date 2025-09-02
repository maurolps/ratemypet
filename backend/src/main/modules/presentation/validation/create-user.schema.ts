import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object(
    {
      name: z.string(),
      email: z.email(),
      password: z.string(),
    },
    { error: "MISSING_BODY" },
  ),
});
