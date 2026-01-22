import { it, describe, expect, beforeAll } from "vitest";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { insertFakeUser } from "./helpers/fake-user";
import { insertFakePet } from "./helpers/fake-pet";

describe("PgPostRepository", () => {
  const postDTO = {
    pet_id: "",
    author_id: "",
    caption: "This is a valid caption for the post",
  };

  beforeAll(async () => {
    const user = await insertFakeUser("fake_post_owner@mail.com");
    const pet = await insertFakePet(user.id);
    postDTO.author_id = user.id;
    postDTO.pet_id = pet.id;
  });

  describe("create", () => {
    it("Should persist and return a Post on success", async () => {
      const sut = new PgPostRepository();
      const post = await sut.create(postDTO);
      expect(post.id).toBeTruthy();
      expect(post.pet_id).toEqual(postDTO.pet_id);
      expect(post.author_id).toEqual(postDTO.author_id);
      expect(post.caption).toEqual(postDTO.caption);
      expect(post.status).toEqual("PUBLISHED");
      expect(post.created_at).toBeInstanceOf(Date);
    });
  });
});
