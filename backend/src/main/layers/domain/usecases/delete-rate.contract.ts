export type DeleteRateStatus = "deleted" | "unchanged";

export interface DeleteRateDTO {
  petId: string;
  userId: string;
}

export type DeleteRateResult = {
  petId: string;
  status: DeleteRateStatus;
};

export interface DeleteRate {
  execute(data: DeleteRateDTO): Promise<DeleteRateResult>;
}
