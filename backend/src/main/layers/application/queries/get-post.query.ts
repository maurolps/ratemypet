import type {
  GetPostData,
  GetPostRatings,
} from "@domain/usecases/get-post.contract";

export type GetPostDetails = {
  post: GetPostData;
  ratings: GetPostRatings;
};

export interface GetPostQuery {
  findPostDetailsById(
    post_id: string,
    viewer_id?: string,
  ): Promise<GetPostDetails | null>;
}
