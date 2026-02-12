import type { Express } from "express";
import request from "supertest";

let uniqueUserCounter = 0;

export const createAndLoginUser = async (app: Express) => {
  const uniqueEmail = `user_${uniqueUserCounter++}@example.com`;
  const userDTO = {
    name: "any_name",
    email: uniqueEmail,
    password: "any_password",
  };

  const createResponse = await request(app).post("/api/users").send(userDTO);
  if (createResponse.status !== 201) {
    throw new Error(`Failed to create user: ${createResponse.status}`);
  }

  return {
    userId: createResponse.body.id as string,
    accessToken: createResponse.body.tokens.accessToken as string,
  };
};
