import { z } from "zod";

export const uploadPetSchema = z
  .object({
    body: z.object(
      {
        name: z.string("MISSING_PARAM").min(3, "INVALID_PARAM"),
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
          ["image/jpeg", "image/png", "image/gif"].includes(file.mimetype),
        {
          message: "INVALID_PARAM",
        },
      ),
  })
  .transform(({ body, user, file }) => {
    return {
      name: body.name,
      userId: user.sub,
      image: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        buffer: file.buffer,
      },
    };
  });
