import { AppError } from "@application/errors/app-error";
import { UpdateProfileUseCase } from "@application/usecases/update-profile.usecase";
import { describe, expect, it, vi } from "vitest";
import { ContentModerationStub } from "./doubles/content-moderation.stub";
import { FindUserRepositoryStub } from "./doubles/find-user.repository.stub";
import { UpdateProfileRepositoryStub } from "./doubles/update-profile.repository.stub";

describe("UpdateProfileUseCase", () => {
  const makeSut = () => {
    const findUserRepositoryStub = new FindUserRepositoryStub();
    const contentModerationStub = new ContentModerationStub();
    const updateProfileRepositoryStub = new UpdateProfileRepositoryStub();
    const findUserRepositorySpy = vi.spyOn(findUserRepositoryStub, "findById");
    const contentModerationSpy = vi.spyOn(contentModerationStub, "execute");
    const updateProfileRepositorySpy = vi.spyOn(
      updateProfileRepositoryStub,
      "updateProfile",
    );
    const sut = new UpdateProfileUseCase(
      findUserRepositoryStub,
      contentModerationStub,
      updateProfileRepositoryStub,
    );

    return {
      sut,
      findUserRepositorySpy,
      contentModerationSpy,
      updateProfileRepositorySpy,
    };
  };

  const updateProfileDTO = {
    user_id: "valid_user_id",
    displayName: "Updated Name",
    bio: "Updated bio",
  };

  it("Should call FindUserRepository.findById with correct values", async () => {
    const { sut, findUserRepositorySpy } = makeSut();

    await sut.execute(updateProfileDTO);

    expect(findUserRepositorySpy).toHaveBeenCalledWith("valid_user_id");
  });

  it("Should throw NOT_FOUND when authenticated user does not exist", async () => {
    const { sut, findUserRepositorySpy } = makeSut();
    findUserRepositorySpy.mockResolvedValueOnce(null);

    await expect(sut.execute(updateProfileDTO)).rejects.toThrow(
      new AppError("NOT_FOUND", "The authenticated user does not exist."),
    );
  });

  it("Should call ContentModeration only for provided displayName", async () => {
    const { sut, contentModerationSpy } = makeSut();

    await sut.execute({
      user_id: "valid_user_id",
      displayName: "Updated Name",
    });

    expect(contentModerationSpy).toHaveBeenCalledTimes(1);
    expect(contentModerationSpy).toHaveBeenCalledWith("Updated Name");
  });

  it("Should call ContentModeration only for provided bio", async () => {
    const { sut, contentModerationSpy } = makeSut();

    await sut.execute({
      user_id: "valid_user_id",
      bio: "Updated bio",
    });

    expect(contentModerationSpy).toHaveBeenCalledTimes(1);
    expect(contentModerationSpy).toHaveBeenCalledWith("Updated bio");
  });

  it("Should throw UNPROCESSABLE_ENTITY when displayName has inappropriate content", async () => {
    const { sut, contentModerationSpy } = makeSut();
    contentModerationSpy.mockResolvedValueOnce({
      isAllowed: false,
      reason: "PROFANITY",
    });

    await expect(
      sut.execute({
        user_id: "valid_user_id",
        displayName: "bad name",
      }),
    ).rejects.toThrow(
      new AppError(
        "UNPROCESSABLE_ENTITY",
        "Display name has inappropriate content.",
      ),
    );
  });

  it("Should throw UNPROCESSABLE_ENTITY when bio has inappropriate content", async () => {
    const { sut, contentModerationSpy } = makeSut();
    contentModerationSpy.mockResolvedValueOnce({
      isAllowed: false,
      reason: "PROFANITY",
    });

    await expect(
      sut.execute({
        user_id: "valid_user_id",
        bio: "bad bio",
      }),
    ).rejects.toThrow(
      new AppError("UNPROCESSABLE_ENTITY", "Bio has inappropriate content."),
    );
  });

  it("Should not call UpdateProfileRepository when no changes are detected", async () => {
    const { sut, updateProfileRepositorySpy } = makeSut();

    const result = await sut.execute({
      user_id: "valid_user_id",
      displayName: "valid_display_name",
      bio: "Pet lover 🐶",
    });

    expect(updateProfileRepositorySpy).not.toHaveBeenCalled();
    expect(result).toEqual({
      id: "valid_user_id",
      displayName: "valid_display_name",
      bio: "Pet lover 🐶",
    });
  });

  it("Should call UpdateProfileRepository with only provided fields", async () => {
    const { sut, updateProfileRepositorySpy } = makeSut();

    await sut.execute({
      user_id: "valid_user_id",
      displayName: "Updated Name",
    });

    expect(updateProfileRepositorySpy).toHaveBeenCalledWith({
      id: "valid_user_id",
      displayName: "Updated Name",
    });
  });

  it("Should return updated profile data on success", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(updateProfileDTO);

    expect(result).toEqual({
      id: "valid_user_id",
      displayName: "Updated Name",
      bio: "Updated bio",
    });
  });
});
