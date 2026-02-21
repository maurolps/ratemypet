import type { PostExistsQuery } from "@application/queries/post-exists.query";

export class PostExistsQueryStub implements PostExistsQuery {
  async existsById(_: string): Promise<boolean> {
    return true;
  }
}
