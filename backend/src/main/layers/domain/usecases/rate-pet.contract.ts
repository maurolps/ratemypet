import type { RateValue } from "@domain/entities/rate";

export interface RatePetDTO {
  petId: string;
  userId: string;
  rate: RateValue;
}

export type RatePetResult = {
  petId: string;
  rate: RateValue;
};

export interface RatePet {
  execute(data: RatePetDTO): Promise<RatePetResult>;
}
