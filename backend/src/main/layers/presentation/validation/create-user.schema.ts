import { z } from "zod";

export const createUserSchema = z
  .object({
    body: z.object(
      {
        name: z
          .string("MISSING_PARAM")
          .min(3, "INVALID_NAME")
          .max(70, "INVALID_PARAM")
          .trim()
          .normalize("NFKC")
          .transform((val) => val.replace(/\s+/g, " ")),
        email: z
          .string("MISSING_PARAM")
          .trim()
          .email("INVALID_PARAM")
          .toLowerCase(),
        password: z
          .string("MISSING_PARAM")
          .min(6, "WEAK_PASSWORD")
          .max(32, "INVALID_PARAM"),
      },
      { error: "MISSING_BODY" },
    ),
  })
  .transform((data) => data.body);
