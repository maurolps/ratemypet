import { CreatePostUseCase } from "@application/usecases/create-post.usecase";
import { describe, vi, it, expect } from "vitest";
import { FindPetRepositoryStub } from "./doubles/find-pet.repository.stub";
import { AppError } from "@application/errors/app-error";
import { ContentModerationStub } from "./doubles/content-moderation.stub";
import { CreatePostRepositoryStub } from "./doubles/create-post.repository.stub";

describe("CreatePostUseCase", () => {
  const makeSut = () => {
    const findPetRepositoryStub = new FindPetRepositoryStub();
    const findPetRepositorySpy = vi.spyOn(findPetRepositoryStub, "findById");
    const contentModerationStub = new ContentModerationStub();
    const contentModerationSpy = vi.spyOn(contentModerationStub, "execute");
    const createPostRepositoryStub = new CreatePostRepositoryStub();
    const createPostRepositorySpy = vi.spyOn(createPostRepositoryStub, "save");
    const sut = new CreatePostUseCase(
      findPetRepositoryStub,
      contentModerationStub,
      createPostRepositoryStub,
    );
    return {
      sut,
      findPetRepositorySpy,
      contentModerationSpy,
      createPostRepositorySpy,
    };
  };

  const postDTO = {
    pet_id: "valid_pet_id",
    author_id: "valid_owner_id",
    caption: "valid_caption",
  };

  it("Should call FindPetRepository.findById with correct value", async () => {
    const { sut, findPetRepositorySpy } = makeSut();
    await sut.execute(postDTO);
    expect(findPetRepositorySpy).toHaveBeenCalledWith("valid_pet_id");
  });

  it("Should throw FORBIDDEN if pet does not belong to the author", async () => {
    const { sut, findPetRepositorySpy } = makeSut();
    findPetRepositorySpy.mockResolvedValueOnce({
      id: "valid_pet_id",
      owner_id: "different_owner_id",
      name: "valid_pet_name",
      type: "dog",
      image_url: "valid_pet_image_url",
      caption: "valid_caption",
      created_at: new Date(),
    });
    await expect(sut.execute(postDTO)).rejects.toThrow(
      new AppError(
        "FORBIDDEN",
        "You do not have permission to create a post for this pet.",
      ),
    );
  });

  it("Should throw NOT_FOUND if pet is not found", async () => {
    const { sut, findPetRepositorySpy } = makeSut();
    findPetRepositorySpy.mockResolvedValueOnce(null);
    const promise = sut.execute(postDTO);
    await expect(promise).rejects.toThrow(
      new AppError("NOT_FOUND", "The specified pet does not exist."),
    );
  });

  it("Should not run ContentModeration if user caption is empty", async () => {
    const { sut, contentModerationSpy } = makeSut();
    const emptyCaptionPostDTO = {
      ...postDTO,
      caption: "",
    };
    await sut.execute(emptyCaptionPostDTO);
    expect(contentModerationSpy).toHaveBeenCalledTimes(0);
  });

  it("Should throw UNPROCESSABLE_ENTITY if caption has inappropriate content", async () => {
    const { sut, contentModerationSpy } = makeSut();
    contentModerationSpy.mockResolvedValueOnce({
      isAllowed: false,
      reason: "PROFANITY",
    });
    const promise = sut.execute(postDTO);
    await expect(promise).rejects.toThrow(
      new AppError(
        "UNPROCESSABLE_ENTITY",
        "Caption has inappropriate content.",
      ),
    );
  });

  it("Should call CreatePostRepository.save with correct values", async () => {
    const { sut, createPostRepositorySpy } = makeSut();
    await sut.execute(postDTO);
    const createdPost = createPostRepositorySpy.mock.calls[0][0];
    const state = createdPost.toState;
    expect(state.pet_id).toBe("valid_pet_id");
    expect(state.author_id).toBe("valid_owner_id");
    expect(state.caption).toBe("valid_caption");
    expect(state.status).toBe("PUBLISHED");
    expect(state.likes_count).toBe(0);
    expect(state.comments_count).toBe(0);
  });

  it("Should return a Post on success", async () => {
    const { sut } = makeSut();
    const post = await sut.execute(postDTO);
    const state = post.toState;
    expect(state.id).toBe("valid_post_id");
    expect(state.pet_id).toBe("valid_pet_id");
    expect(state.author_id).toBe("valid_owner_id");
    expect(state.caption).toBe("valid_caption");
    expect(state.status).toBe("PUBLISHED");
    expect(state.likes_count).toBe(0);
    expect(state.comments_count).toBe(0);
    expect(state.created_at).toBeDefined();
  });
});
