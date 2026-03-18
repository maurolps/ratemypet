import type { User } from "@domain/entities/user";
import type { UserResponse } from "@domain/usecases/login.contract";

export const toUserResponse = (user: User): UserResponse => ({
  id: user.id,
  email: user.email,
  displayName: user.displayName ?? user.name,
  ...(user.bio !== undefined ? { bio: user.bio } : {}),
  ...(user.picture !== undefined ? { picture: user.picture } : {}),
  createdAt: user.createdAt,
});
