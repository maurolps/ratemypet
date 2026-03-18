import { FIXED_DATE } from "../../config/constants";
import { describe, expect, it } from "vitest";
import { toUser } from "@infra/mappers/user-mapper";

describe("toUser", () => {
  it("Should keep created_at as-is when it is already a Date", () => {
    const createdAt = new Date("2026-03-10T12:00:00.000Z");

    const user = toUser({
      id: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      display_name: "valid_display_name",
      bio: "Pet lover 🐶",
      picture: null,
      created_at: createdAt,
    });

    expect(user).toEqual({
      id: "valid_user_id",
      name: "valid_name",
      displayName: "valid_display_name",
      email: "valid_email@mail.com",
      bio: "Pet lover 🐶",
      createdAt: createdAt,
    });
  });

  it("Should convert created_at when it is a string", () => {
    const user = toUser({
      id: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      display_name: "valid_display_name",
      bio: "Pet lover 🐶",
      picture: null,
      created_at: "2026-03-10T12:00:00.000Z",
    });

    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.createdAt.toISOString()).toBe("2026-03-10T12:00:00.000Z");
  });

  it("Should keep picture when present", () => {
    const user = toUser({
      id: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      display_name: "valid_display_name",
      bio: "Pet lover 🐶",
      picture: "https://valid.picture/image.png",
      created_at: FIXED_DATE,
    });

    expect(user.picture).toEqual("https://valid.picture/image.png");
    expect(user.displayName).toEqual("valid_display_name");
    expect(user.bio).toEqual("Pet lover 🐶");
  });
});
