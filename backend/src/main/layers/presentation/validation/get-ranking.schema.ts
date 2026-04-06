import { z } from "zod";

export const getRankingSchema = z
  .object({
    query: z
      .object({
        type: z.enum(["dog", "cat"], "INVALID_PARAM").optional(),
      })
      .optional(),
  })
  .transform(({ query }) => ({
    type: query?.type,
  }));
