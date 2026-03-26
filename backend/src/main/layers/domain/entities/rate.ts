export const RATE_VALUES = [
  "cute",
  "funny",
  "majestic",
  "chaos",
  "smart",
  "sleepy",
] as const;

export type RateValue = (typeof RATE_VALUES)[number];

export type Rate = {
  petId: string;
  userId: string;
  rate: RateValue;
  createdAt?: Date;
  updatedAt?: Date;
};
