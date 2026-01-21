import type { ProfanityChecker } from "@application/ports/profanity-checker.contract";
import type {
  ContentModeration,
  ModerationResult,
} from "@application/ports/content-moderation.contract";

export class ContentModerationService implements ContentModeration {
  constructor(private readonly profanityChecker: ProfanityChecker) {}

  async execute(text: string): Promise<ModerationResult> {
    const _hasProfanity = await this.profanityChecker.perform(text);
    return { isAllowed: true };
  }
}
