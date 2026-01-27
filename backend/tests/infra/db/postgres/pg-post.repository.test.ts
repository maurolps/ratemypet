import { it, describe, expect, beforeAll } from "vitest";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { Post } from "@domain/entities/post";
import { insertFakeUser } from "./helpers/fake-user";
import { insertFakePet } from "./helpers/fake-pet";

describe("PgPostRepository", () => {
  const postDTO = {
    pet_id: "",
    author_id: "",
    default_caption: "This is a default caption for the pet",
    caption: "This is a valid caption for the post",
  };

  beforeAll(async () => {
    const user = await insertFakeUser("fake_post_owner@mail.com");
    const pet = await insertFakePet(user.id);
    postDTO.author_id = user.id;
    postDTO.pet_id = pet.id;
  });

  describe("save", () => {
    it("Should persist and return a Post on success", async () => {
      const sut = new PgPostRepository();
      const post = await sut.save(Post.create(postDTO));
      const state = post.toState;
      expect(state.id).toBeTruthy();
      expect(state.pet_id).toEqual(postDTO.pet_id);
      expect(state.author_id).toEqual(postDTO.author_id);
      expect(state.caption).toEqual(postDTO.caption);
      expect(state.status).toEqual("PUBLISHED");
      expect(state.created_at).toBeInstanceOf(Date);
    });
  });
});
