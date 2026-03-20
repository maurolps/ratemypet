import { AppError } from "@application/errors/app-error";
import { GetProfileUseCase } from "@application/usecases/get-profile.usecase";
import { describe, expect, it, vi } from "vitest";
import { FIXED_DATE } from "../config/constants";
import { GetProfilePetsQueryStub } from "./doubles/get-profile-pets.query.stub";
import { GetProfileProfileQueryStub } from "./doubles/get-profile-profile.query.stub";

describe("GetProfileUseCase", () => {
  const makeSut = () => {
    const getProfileProfileQueryStub = new GetProfileProfileQueryStub();
    const getProfilePetsQueryStub = new GetProfilePetsQueryStub();
    const findByUserIdSpy = vi.spyOn(
      getProfileProfileQueryStub,
      "findByUserId",
    );
    const findByOwnerIdSpy = vi.spyOn(getProfilePetsQueryStub, "findByOwnerId");
    const sut = new GetProfileUseCase(
      getProfileProfileQueryStub,
      getProfilePetsQueryStub,
    );

    return {
      sut,
      findByUserIdSpy,
      findByOwnerIdSpy,
    };
  };

  const getProfileDTO = {
    user_id: "valid_user_id",
  };

  it("Should call GetProfileProfileQuery.findByUserId with correct values", async () => {
    const { sut, findByUserIdSpy } = makeSut();

    await sut.execute(getProfileDTO);

    expect(findByUserIdSpy).toHaveBeenCalledWith("valid_user_id");
  });

  it("Should throw NOT_FOUND when requested user does not exist", async () => {
    const { sut, findByUserIdSpy } = makeSut();
    findByUserIdSpy.mockResolvedValueOnce(null);

    await expect(sut.execute(getProfileDTO)).rejects.toThrow(
      new AppError("NOT_FOUND", "The requested user does not exist."),
    );
  });

  it("Should call GetProfilePetsQuery.findByOwnerId with correct values", async () => {
    const { sut, findByOwnerIdSpy } = makeSut();

    await sut.execute(getProfileDTO);

    expect(findByOwnerIdSpy).toHaveBeenCalledWith("valid_user_id");
  });

  it("Should return public profile summary with pets on success", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(getProfileDTO);

    expect(result).toEqual({
      id: "valid_user_id",
      displayName: "valid_display_name",
      bio: "Pet lover 🐶",
      createdAt: FIXED_DATE,
      picture: "https://valid.picture/profile.png",
      stats: {
        postsCount: 2,
        likesReceived: 7,
      },
      pets: [
        {
          id: "valid_pet_id",
          name: "valid_pet_name",
          type: "dog",
          imageUrl: "https://valid.image/pet.png",
        },
      ],
    });
  });
});
