import { describe, expect, it } from "vitest";
import { ContentModerationService } from "@application/services/content-moderation.service";

describe("ContentModerationService", () => {
  const makeSut = () => {
    const sut = new ContentModerationService();
    return { sut };
  };

  it("Should allow clean text", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(
      "This text contains no profanity or malicious content.",
    );
    expect(result).toEqual({ isAllowed: true });
  });
});
