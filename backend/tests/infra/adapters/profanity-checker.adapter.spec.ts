import { describe, expect, it } from "vitest";
import { ProfanityCheckerAdapter } from "@infra/adapters/profanity-checker.adapter";

describe("ProfanityChecker Adapter", () => {
  const makeSut = () => {
    const sut = new ProfanityCheckerAdapter();
    return { sut };
  };

  const englishText = "This text contains profanity word: shit.";
  const portugueseText = "This text contains profanity word in pt-br: merda.";

  it("Should return true when English profanity is present", async () => {
    const { sut } = makeSut();
    const result = await sut.perform(englishText);
    expect(result).toBe(true);
  });

  it("Should return true when Portuguese profanity is present", async () => {
    const { sut } = makeSut();
    const result = await sut.perform(portugueseText);
    expect(result).toBe(true);
  });
});
