export type Post = {
  id: string;
  pet_id: string;
  author_id: string;
  caption: string;
  status: "PENDING_REVIEW" | "PUBLISHED" | "REJECTED";
  created_at: Date;
};
