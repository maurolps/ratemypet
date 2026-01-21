export type ModerationReason =
  | "PROFANITY"
  | "MALICIOUS_CONTENT"
  | "UNSAFE_LINK";

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
