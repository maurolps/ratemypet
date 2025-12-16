export type PetType = "dog" | "cat";

export type Pet = {
  id: string;
  name: string;
  type: PetType;
  image_url: string;
  caption: string;
  created_at: Date;
};
