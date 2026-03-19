export interface UpdateProfileDTO {
  user_id: string;
  displayName?: string;
  bio?: string;
}

export type UpdateProfileResult = {
  id: string;
  displayName: string;
  bio: string;
};

export interface UpdateProfile {
  execute(data: UpdateProfileDTO): Promise<UpdateProfileResult>;
}
