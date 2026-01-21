import type {
  ContentModeration,
  ModerationResult,
} from "@application/ports/content-moderation.contract";

export class ContentModerationService implements ContentModeration {
  async execute(_text: string): Promise<ModerationResult> {
    return { isAllowed: true };
  }
}
