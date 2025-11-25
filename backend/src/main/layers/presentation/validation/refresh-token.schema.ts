import { z } from "zod";

export const refreshTokenSchema = z
  .object({
    cookies: z.object(
      {
        refreshToken: z
          .string("MISSING_PARAM")
          .refine((token) => token.split(".").length === 2, {
            message: "UNAUTHORIZED",
          }),
      },
      { error: "MISSING_PARAM" },
    ),
  })
  .transform(({ cookies }) => {
    const [id, secret] = cookies.refreshToken.split(".");
    return { id, secret };
  });
