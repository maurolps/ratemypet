import type { GetProfileData } from "@domain/usecases/get-profile.contract";

export interface GetProfileProfileQuery {
  findByUserId(user_id: string): Promise<GetProfileData | null>;
}
