export interface PostExistsQuery {
  existsById(post_id: string): Promise<boolean>;
}
