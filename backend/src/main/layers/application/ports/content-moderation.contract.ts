export type ModerationReason = "PROFANITY";

export type ModerationResult =
  | {
      isAllowed: true;
    }
  | {
      isAllowed: false;
      reason?: ModerationReason;
    };

export interface ContentModeration {
  execute(text: string): Promise<ModerationResult>;
}
