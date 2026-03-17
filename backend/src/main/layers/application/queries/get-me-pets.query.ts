import type { GetMePet } from "@domain/usecases/get-me.contract";

export interface GetMePetsQuery {
  findByOwnerId(user_id: string): Promise<GetMePet[]>;
}
