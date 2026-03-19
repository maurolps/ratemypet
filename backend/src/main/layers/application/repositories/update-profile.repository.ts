import type { User } from "@domain/entities/user";

export type UpdateProfileData = {
  id: string;
  displayName?: string;
  bio?: string;
};

export interface UpdateProfileRepository {
  updateProfile(data: UpdateProfileData): Promise<User | null>;
}
