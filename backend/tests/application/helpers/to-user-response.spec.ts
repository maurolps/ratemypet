import { describe, expect, it } from "vitest";
import { toUserResponse } from "@application/helpers/to-user-response";
import { FIXED_DATE } from "../../config/constants";

describe("toUserResponse", () => {
  it("Should fallback to name and omit optional fields when they are undefined", () => {
    const result = toUserResponse({
      id: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      createdAt: FIXED_DATE,
    });

    expect(result).toEqual({
      id: "valid_user_id",
      email: "valid_email@mail.com",
      displayName: "valid_name",
      createdAt: FIXED_DATE,
    });
  });

  it("Should preserve bio and nullable picture when provided", () => {
    const result = toUserResponse({
      id: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      displayName: "valid_display_name",
      bio: "valid_bio",
      picture: null,
      createdAt: FIXED_DATE,
    });

    expect(result).toEqual({
      id: "valid_user_id",
      email: "valid_email@mail.com",
      displayName: "valid_display_name",
      bio: "valid_bio",
      picture: null,
      createdAt: FIXED_DATE,
    });
  });
});
