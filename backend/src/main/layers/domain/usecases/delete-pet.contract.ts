export interface DeletePetDTO {
  pet_id: string;
  user_id: string;
}

export interface DeletePet {
  execute(data: DeletePetDTO): Promise<void>;
}
