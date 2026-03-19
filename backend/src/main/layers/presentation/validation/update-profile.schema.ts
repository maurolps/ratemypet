import { z } from "zod";

const DISPLAY_NAME_MIN_LENGTH = 3;
const DISPLAY_NAME_MAX_LENGTH = 70;
const BIO_MAX_LENGTH = 160;

const sanitizeText = (val: string) => val.replace(/\s+/g, " ");

export const updateProfileSchema = z
  .object({
    body: z.object(
      {
        displayName: z
          .string()
          .trim()
          .min(DISPLAY_NAME_MIN_LENGTH, "INVALID_PARAM")
          .max(DISPLAY_NAME_MAX_LENGTH, "INVALID_PARAM")
          .normalize("NFC")
          .transform(sanitizeText)
          .optional(),
        bio: z
          .string()
          .trim()
          .max(BIO_MAX_LENGTH, "INVALID_PARAM")
          .normalize("NFC")
          .transform(sanitizeText)
          .optional(),
      },
      { error: "MISSING_BODY" },
    ),
    user: z.object(
      {
        sub: z.string("MISSING_PARAM").trim().uuid("INVALID_PARAM"),
      },
      { error: "MISSING_PARAM" },
    ),
  })
  .refine(
    ({ body }) => body.displayName !== undefined || body.bio !== undefined,
    {
      message: "INVALID_PARAM",
      path: ["body"],
    },
  )
  .transform(({ body, user }) => ({
    user_id: user.sub,
    ...(body.displayName !== undefined
      ? { displayName: body.displayName }
      : {}),
    ...(body.bio !== undefined ? { bio: body.bio } : {}),
  }));
