import type { User } from "@domain/entities/user";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";

type SeedPostRecord = {
  id: string;
  author_id: string;
  pet_id: string;
  created_at: Date;
  comments_count: number;
  likes_count: number;
};

type SeedPetRecord = {
  id: string;
  owner_id: string;
  created_at: Date;
};

export type DatabaseSnapshot = {
  users: number;
  auth_identities: number;
  pets: number;
  posts: number;
  comments: number;
  likes: number;
  ratings: number;
};

const pool = PgPool.getInstance();

const countRows = async (
  tableName: keyof DatabaseSnapshot,
): Promise<number> => {
  const result = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM ${tableName}`,
  );

  return Number(result.rows[0]?.count ?? "0");
};

export const listUsers = async (): Promise<User[]> => {
  const result = await pool.query<User>(
    `
    SELECT id, name, email, picture, created_at
    FROM users
    ORDER BY created_at ASC, id ASC
    `,
  );

  return result.rows;
};

export const listPublishedPosts = async (): Promise<SeedPostRecord[]> => {
  const result = await pool.query<SeedPostRecord>(
    `
    SELECT id, author_id, pet_id, created_at, comments_count, likes_count
    FROM posts
    WHERE status = 'PUBLISHED'
    ORDER BY created_at ASC, id ASC
    `,
  );

  return result.rows;
};

export const listPets = async (): Promise<SeedPetRecord[]> => {
  const result = await pool.query<SeedPetRecord>(
    `
    SELECT id, owner_id, created_at
    FROM pets
    ORDER BY created_at ASC, id ASC
    `,
  );

  return result.rows;
};

export const getDatabaseSnapshot = async (): Promise<DatabaseSnapshot> => {
  const [users, authIdentities, pets, posts, comments, likes, ratings] =
    await Promise.all([
      countRows("users"),
      countRows("auth_identities"),
      countRows("pets"),
      countRows("posts"),
      countRows("comments"),
      countRows("likes"),
      countRows("ratings"),
    ]);

  return {
    users,
    auth_identities: authIdentities,
    pets,
    posts,
    comments,
    likes,
    ratings,
  };
};
