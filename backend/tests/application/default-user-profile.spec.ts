import { describe, expect, it, vi } from "vitest";
import {
  makeDefaultUserProfile,
  pickRandomDefaultBio,
} from "@application/services/default-user-profile";

describe("default-user-profile", () => {
  it("Should return display_name based on the user name", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0);

    const result = makeDefaultUserProfile("Mauro");

    expect(result).toEqual({
      display_name: "Mauro",
      bio: "Pet lover 🐶",
    });
  });

  it("Should pick a deterministic bio based on the random index", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0.95);

    const result = pickRandomDefaultBio();

    expect(result).toBe("Always stopping for a pet 🐾");
  });
});
