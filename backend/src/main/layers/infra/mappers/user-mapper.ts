import type { User } from "@domain/entities/user";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  picture?: string | null;
  created_at: Date | string;
};

export const toUser = (row: UserRow): User => {
  const user: User = {
    id: row.id,
    name: row.name,
    email: row.email,
    created_at:
      row.created_at instanceof Date
        ? row.created_at
        : new Date(row.created_at),
  };

  if (row.picture) {
    user.picture = row.picture;
  }

  return user;
};
