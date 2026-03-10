import type { User } from "@domain/entities/user";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  created_at: Date | string;
};

export const toUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  created_at:
    row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
});
