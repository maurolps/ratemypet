import { describe, expect, it, vi } from "vitest";
import { CreatePostController } from "@presentation/controllers/create-post.controller";
import { CreatePostValidatorStub } from "./doubles/create-post.validator.stub";

describe("CreatePostController", () => {
  const makeSut = () => {
    const httpValidatorStub = new CreatePostValidatorStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const sut = new CreatePostController(httpValidatorStub);
    return { sut, httpValidatorSpy };
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
});
