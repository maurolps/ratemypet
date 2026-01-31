import { makeApp } from "@main/http/app";
import { describe, it, expect } from "vitest";
import request from "supertest";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { Post } from "@domain/entities/post";
import { insertFakePet } from "../infra/db/postgres/helpers/fake-pet";

describe("[E2E] UC-007 LikePost", () => {
  it("Should like a post and return status 200", async () => {
    const app = makeApp();
    const userDTO = {
      name: "any_name",
      email: `like_post_${Date.now()}@example.com`,
      password: "any_password",
    };

    const createdUserResponse = await request(app)
      .post("/api/users")
      .send(userDTO);
    const userId = createdUserResponse.body.id as string;

    const loginResponse = await request(app).post("/api/users/login").send({
      email: userDTO.email,
      password: userDTO.password,
    });

    const accessToken = loginResponse.body.tokens.accessToken as string;

    const pet = await insertFakePet(userId);
    const postRepository = new PgPostRepository();
    const post = await postRepository.save(
      Post.create({
        pet_id: pet.id,
        author_id: userId,
        default_caption: "A default caption",
        caption: "A valid caption",
      }),
    );

    const response = await request(app)
      .post(`/api/posts/${post.toState.id}/likes`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.like.post_id).toEqual(post.toState.id);
    expect(response.body.like.user_id).toEqual(userId);
    expect(response.body.likes_count).toBe(1);
  });
});
