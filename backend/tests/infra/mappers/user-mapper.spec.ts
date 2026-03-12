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
      picture: null,
      created_at: createdAt,
    });

    expect(user).toEqual({
      id: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      created_at: createdAt,
    });
  });

  it("Should convert created_at when it is a string", () => {
    const user = toUser({
      id: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      picture: null,
      created_at: "2026-03-10T12:00:00.000Z",
    });

    expect(user.created_at).toBeInstanceOf(Date);
    expect(user.created_at.toISOString()).toBe("2026-03-10T12:00:00.000Z");
  });

  it("Should keep picture when present", () => {
    const user = toUser({
      id: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      picture: "https://valid.picture/image.png",
      created_at: FIXED_DATE,
    });

    expect(user.picture).toEqual("https://valid.picture/image.png");
  });
});
