import profanity from "leo-profanity";
import type { ProfanityChecker } from "@application/ports/profanity-checker.contract";
import { BAD_WORDS_PT_BR } from "@infra/config/bad-words-pt-br";

export class ProfanityCheckerAdapter implements ProfanityChecker {
  private static isInitialized = false;

  constructor() {
    if (!ProfanityCheckerAdapter.isInitialized) {
      profanity.clearList();
      profanity.add(profanity.getDictionary("en"));
      profanity.add(BAD_WORDS_PT_BR);
      ProfanityCheckerAdapter.isInitialized = true;
    }
  }

  async perform(text: string): Promise<boolean> {
    return profanity.check(text);
  }
}
