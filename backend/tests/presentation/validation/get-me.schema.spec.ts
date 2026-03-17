import { describe, expect, it } from "vitest";
import { getMeSchema } from "@presentation/validation/get-me.schema";

describe("getMeSchema", () => {
  it("Should parse authenticated user id on success", () => {
    const result = getMeSchema.parse({
      user: {
        sub: crypto.randomUUID(),
      },
    });

    expect(result).toEqual({
      user_id: expect.any(String),
    });
  });

  it("Should throw when user is missing", () => {
    const result = getMeSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("Should throw when user id is invalid", () => {
    const result = getMeSchema.safeParse({
      user: {
        sub: "invalid_user_id",
      },
    });

    expect(result.success).toBe(false);
  });
});
