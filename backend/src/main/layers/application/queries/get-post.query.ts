import type { GetPostData } from "@domain/usecases/get-post.contract";

export interface GetPostQuery {
  findPostDetailsById(
    post_id: string,
    viewer_id?: string,
  ): Promise<GetPostData | null>;
}
