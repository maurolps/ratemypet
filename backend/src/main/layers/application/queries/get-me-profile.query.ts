import type { GetMeProfile } from "@domain/usecases/get-me.contract";

export interface GetMeProfileQuery {
  findByUserId(user_id: string): Promise<GetMeProfile | null>;
}
