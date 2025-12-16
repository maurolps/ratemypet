import { z } from "zod";

export const uploadPetSchema = z
  .object({
    body: z.object(
      {
        petName: z
          .string("MISSING_PARAM")
          .min(3, "INVALID_NAME")
          .max(70, "INVALID_PARAM")
          .trim()
          .normalize("NFKC")
          .transform((val) => val.replace(/\s+/g, " ")),
      },
      { error: "MISSING_PARAM" },
    ),
    user: z.object(
      {
        sub: z.string(),
        name: z.string(),
        email: z.email(),
      },
      { error: "MISSING_PARAM" },
    ),
    file: z
      .object(
        {
          originalname: z.string("MISSING_PARAM"),
          mimetype: z.string("MISSING_PARAM"),
          buffer: z.string("MISSING_PARAM"),
        },
        { error: "MISSING_PARAM" },
      )
      .refine(
        (file) =>
          ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype),
        {
          error: "INVALID_PARAM",
        },
      ),
  })
  .transform(({ body, user, file }) => {
    return {
      petName: body.petName,
      userId: user.sub,
      image: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        buffer: file.buffer,
      },
    };
  });
