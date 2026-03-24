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
  pet_id: string;
  user_id: string;
  rate: RateValue;
  created_at?: Date;
  updated_at?: Date;
};
