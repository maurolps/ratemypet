import type { ProfanityChecker } from "@application/ports/profanity-checker.contract";

export class ProfanityCheckerStub implements ProfanityChecker {
  async perform(_text: string): Promise<boolean> {
    return false;
  }
}
