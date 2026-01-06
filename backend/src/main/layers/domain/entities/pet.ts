export type PetType = "dog" | "cat";

export type Pet = {
  id: string;
  name: string;
  type: PetType;
  image_url: string;
  caption: string;
  created_at: Date;
};

export type UnsavedPet = {
  petName: string;
  type: PetType;
  image_url: string;
  caption: string;
};

export type ClassifiedPet = {
  type: PetType;
  caption: string;
};

export type PetImage = {
  originalName: string;
  buffer: Buffer;
  mimeType: string;
};
