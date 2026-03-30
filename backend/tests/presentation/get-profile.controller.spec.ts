import { describe, expect, it, vi } from "vitest";
import { GetProfileController } from "@presentation/controllers/get-profile.controller";
import { GetProfileValidatorStub } from "./doubles/get-profile.validator.stub";
import { GetProfileUseCaseStub } from "./doubles/get-profile.usecase.stub";
import { FIXED_DATE } from "../config/constants";

const { errorPresenterSpy } = vi.hoisted(() => {
  return {
    errorPresenterSpy: vi.fn(),
  };
});

vi.mock("@presentation/errors/error-presenter", () => {
  return {
    ErrorPresenter: errorPresenterSpy,
  };
});

describe("GetProfileController", () => {
  const makeSut = () => {
    const httpValidatorStub = new GetProfileValidatorStub();
    const getProfileUseCaseStub = new GetProfileUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const getProfileUseCaseSpy = vi.spyOn(getProfileUseCaseStub, "execute");
    const sut = new GetProfileController(
      httpValidatorStub,
      getProfileUseCaseStub,
    );

    return {
      sut,
      httpValidatorSpy,
      getProfileUseCaseSpy,
    };
  };

  const dummyRequest = {
    params: {
      id: "valid_user_id",
    },
  };

  it("Should call HttpValidator with correct values", async () => {
    const { sut, httpValidatorSpy } = makeSut();

    await sut.handle(dummyRequest);

    expect(httpValidatorSpy).toHaveBeenCalledWith(dummyRequest);
  });

  it("Should call GetProfile use case with correct values", async () => {
    const { sut, getProfileUseCaseSpy } = makeSut();

    await sut.handle(dummyRequest);

    expect(getProfileUseCaseSpy).toHaveBeenCalledWith({
      user_id: "valid_user_id",
    });
  });

  it("Should return 200 with public profile data on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
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
          ratingsCount: 4,
        },
      ],
    });
  });

  it("Should call ErrorPresenter if any error is thrown", async () => {
    const { sut, httpValidatorSpy } = makeSut();

    httpValidatorSpy.mockImplementationOnce(() => {
      throw new Error("Validation error");
    });

    await sut.handle(dummyRequest);

    expect(errorPresenterSpy).toHaveBeenCalled();
  });
});
