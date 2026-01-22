import type {
  ContentModeration,
  ModerationResult,
} from "@application/ports/content-moderation.contract";

export class ContentModerationStub implements ContentModeration {
  async execute(): Promise<ModerationResult> {
    return { isAllowed: true };
  }
}
