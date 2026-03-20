import { AppError } from "@application/errors/app-error";
import { GetMeUseCase } from "@application/usecases/get-me.usecase";
import { describe, expect, it, vi } from "vitest";
import { FIXED_DATE } from "../config/constants";
import { GetMePetsQueryStub } from "./doubles/get-me-pets.query.stub";
import { GetMeProfileQueryStub } from "./doubles/get-me-profile.query.stub";

describe("GetMeUseCase", () => {
  const makeSut = () => {
    const getMeProfileQueryStub = new GetMeProfileQueryStub();
    const getMePetsQueryStub = new GetMePetsQueryStub();
    const findByUserIdSpy = vi.spyOn(getMeProfileQueryStub, "findByUserId");
    const findByOwnerIdSpy = vi.spyOn(getMePetsQueryStub, "findByOwnerId");
    const sut = new GetMeUseCase(getMeProfileQueryStub, getMePetsQueryStub);

    return {
      sut,
      findByUserIdSpy,
      findByOwnerIdSpy,
    };
  };

  const getMeDTO = {
    user_id: "valid_user_id",
  };

  it("Should call GetMeProfileQuery.findByUserId with correct values", async () => {
    const { sut, findByUserIdSpy } = makeSut();

    await sut.execute(getMeDTO);

    expect(findByUserIdSpy).toHaveBeenCalledWith("valid_user_id");
  });

  it("Should throw NOT_FOUND when authenticated user does not exist", async () => {
    const { sut, findByUserIdSpy } = makeSut();
    findByUserIdSpy.mockResolvedValueOnce(null);

    await expect(sut.execute(getMeDTO)).rejects.toThrow(
      new AppError("NOT_FOUND", "The authenticated user does not exist."),
    );
  });

  it("Should call GetMePetsQuery.findByOwnerId with correct values", async () => {
    const { sut, findByOwnerIdSpy } = makeSut();

    await sut.execute(getMeDTO);

    expect(findByOwnerIdSpy).toHaveBeenCalledWith("valid_user_id");
  });

  it("Should return profile summary with pets on success", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(getMeDTO);

    expect(result).toEqual({
      id: "valid_user_id",
      displayName: "valid_display_name",
      email: "valid_email@mail.com",
      bio: "Pet lover 🐶",
      createdAt: FIXED_DATE,
      picture: "https://valid.picture/me.png",
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
