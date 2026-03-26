import { RATE_VALUES, type RateValue } from "@domain/entities/rate";
import { z } from "zod";

export const ratePetSchema = z
  .object({
    params: z.object(
      {
        id: z.string("MISSING_PARAM").trim().uuid("INVALID_PARAM"),
      },
      { error: "MISSING_PARAM" },
    ),
    body: z.object(
      {
        rate: z.enum(RATE_VALUES, "INVALID_PARAM"),
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
  .transform(({ params, body, user }) => {
    return {
      petId: params.id,
      userId: user.sub,
      rate: body.rate as RateValue,
    };
  });
