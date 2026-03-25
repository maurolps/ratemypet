export interface DeleteRateRepository {
  deleteByPetIdAndUserId(petId: string, userId: string): Promise<boolean>;
}
