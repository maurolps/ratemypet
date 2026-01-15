import { describe, expect, it, vi } from "vitest";
import { CreatePostController } from "@presentation/controllers/create-post.controller";
import { CreatePostValidatorStub } from "./doubles/create-post.validator.stub";
import { CreatePostUseCaseStub } from "./doubles/create-post.usecase.stub";

describe("CreatePostController", () => {
  const makeSut = () => {
    const httpValidatorStub = new CreatePostValidatorStub();
    const createPostUseCaseStub = new CreatePostUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const createPostUseCaseSpy = vi.spyOn(createPostUseCaseStub, "execute");
    const sut = new CreatePostController(
      httpValidatorStub,
      createPostUseCaseStub,
    );
    return { sut, httpValidatorSpy, createPostUseCaseSpy };
  };

  const dummyRequest = {
    body: {
      pet_id: "valid_pet_id",
      author_id: "valid_author_id",
      caption: "A cute pet!",
    },
    user: {
      sub: "authenticated_user_id",
      name: "authenticated_user_name",
      email: "authenticated_user_email",
    },
  };

  it("Should call HttpValidator with correct values", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(httpValidatorSpy).toHaveBeenCalledWith(dummyRequest);
  });

  it("Should call CreatePost use case with correct values", async () => {
    const { sut, createPostUseCaseSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(createPostUseCaseSpy).toHaveBeenCalledWith({
      pet_id: "valid_pet_id",
      author_id: "valid_author_id",
      caption: "valid_caption",
    });
  });

  it("Should return 201 with post data on successful creation", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(201);
    expect(httpResponse.body).toEqual({
      id: "valid_post_id",
      pet_id: "valid_pet_id",
      author_id: "valid_author_id",
      caption: "valid_caption",
      status: "PUBLISHED",
      created_at: expect.any(Date),
    });
  });
});
