import type { RateValue } from "@domain/entities/rate";

export interface RatePetDTO {
  pet_id: string;
  user_id: string;
  rate: RateValue;
}

export type RatePetResult = {
  pet_id: string;
  rate: RateValue;
};

export interface RatePet {
  execute(data: RatePetDTO): Promise<RatePetResult>;
}
