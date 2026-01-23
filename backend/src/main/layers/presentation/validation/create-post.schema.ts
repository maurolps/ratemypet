import { z } from "zod";

const CAPTION_MIN_LENGTH = 3;
const CAPTION_MAX_LENGTH = 280;

export const createPostSchema = z
  .object({
    body: z.object(
      {
        pet_id: z.string("MISSING_PARAM").trim().min(1, "INVALID_PARAM"),
        caption: z
          .string()
          .min(CAPTION_MIN_LENGTH, "INVALID_PARAM")
          .max(CAPTION_MAX_LENGTH, "INVALID_PARAM")
          .trim()
          .normalize("NFKC")
          .transform((val) => val.replace(/\s+/g, " "))
          .optional(),
      },
      { error: "MISSING_BODY" },
    ),
    user: z.object(
      {
        sub: z.string("MISSING_PARAM"),
      },
      { error: "MISSING_PARAM" },
    ),
  })
  .transform(({ body, user }) => {
    return {
      pet_id: body.pet_id,
      author_id: user.sub,
      caption: body.caption ?? "",
    };
  });
