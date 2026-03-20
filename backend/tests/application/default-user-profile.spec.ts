import { describe, expect, it, vi } from "vitest";
import {
  makeDefaultUserProfile,
  pickRandomDefaultBio,
} from "@application/helpers/default-user-profile";

describe("default-user-profile", () => {
  it("Should return displayName based on the user name", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0);

    const result = makeDefaultUserProfile("Mauro");

    expect(result.displayName).toBe("Mauro");
    expect(result.bio).toBe("Pet lover 🐶");
    expect(result.picture).toBeTruthy();
  });

  it("Should pick a deterministic bio based on the random index", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0);

    const result = pickRandomDefaultBio();

    expect(result).toBe("Pet lover 🐶");
  });
});
