import { describe, expect, it, vi } from "vitest";
import { ContentModerationService } from "@application/services/content-moderation.service";
import { ProfanityCheckerStub } from "../doubles/profanity-checker.stub";

describe("ContentModerationService", () => {
  const makeSut = () => {
    const profanityCheckerStub = new ProfanityCheckerStub();
    const profanityCheckerSpy = vi.spyOn(profanityCheckerStub, "perform");
    const sut = new ContentModerationService(profanityCheckerStub);
    return { sut, profanityCheckerStub, profanityCheckerSpy };
  };

  const validText = "This is a clean text without any bad words.";

  it("Should allow clean text", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(validText);
    expect(result).toEqual({ isAllowed: true });
  });

  it("Should block text when profanity is detected", async () => {
    const { sut, profanityCheckerStub } = makeSut();
    vi.spyOn(profanityCheckerStub, "perform").mockResolvedValueOnce(true);
    const result = await sut.execute(validText);
    expect(result).toEqual({ isAllowed: false, reason: "PROFANITY" });
  });

  it("Should call ProfanityChecker.perform with correct value", async () => {
    const { sut, profanityCheckerSpy } = makeSut();
    await sut.execute(validText);
    expect(profanityCheckerSpy).toHaveBeenCalledWith(validText);
  });
});
