import type { User } from "@domain/entities/user";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  display_name?: string | null;
  bio?: string | null;
  picture?: string | null;
  created_at: Date | string;
};

export const toUser = (row: UserRow): User => {
  const user: User = {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at
        : new Date(row.created_at),
  };

  if (row.display_name) {
    user.displayName = row.display_name;
  }

  if (row.bio !== undefined && row.bio !== null) {
    user.bio = row.bio;
  }

  if (row.picture) {
    user.picture = row.picture;
  }

  return user;
};
