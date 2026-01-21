export interface ProfanityChecker {
  perform(text: string): Promise<boolean>;
}
