import { describe, expect, it, vi } from "vitest";
import { GetMeController } from "@presentation/controllers/get-me.controller";
import { GetMeValidatorStub } from "./doubles/get-me.validator.stub";
import { GetMeUseCaseStub } from "./doubles/get-me.usecase.stub";
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

describe("GetMeController", () => {
  const makeSut = () => {
    const httpValidatorStub = new GetMeValidatorStub();
    const getMeUseCaseStub = new GetMeUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const getMeUseCaseSpy = vi.spyOn(getMeUseCaseStub, "execute");
    const sut = new GetMeController(httpValidatorStub, getMeUseCaseStub);

    return {
      sut,
      httpValidatorSpy,
      getMeUseCaseSpy,
    };
  };

  const dummyRequest = {
    user: {
      sub: "valid_user_id",
      name: "valid_name",
      email: "valid_email@mail.com",
    },
  };

  it("Should call HttpValidator with correct values", async () => {
    const { sut, httpValidatorSpy } = makeSut();

    await sut.handle(dummyRequest);

    expect(httpValidatorSpy).toHaveBeenCalledWith(dummyRequest);
  });

  it("Should call GetMe use case with correct values", async () => {
    const { sut, getMeUseCaseSpy } = makeSut();

    await sut.handle(dummyRequest);

    expect(getMeUseCaseSpy).toHaveBeenCalledWith({
      user_id: "valid_user_id",
    });
  });

  it("Should return 200 with profile data on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
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

  it("Should call ErrorPresenter if any error is thrown", async () => {
    const { sut, httpValidatorSpy } = makeSut();

    httpValidatorSpy.mockImplementationOnce(() => {
      throw new Error("Validation error");
    });

    await sut.handle(dummyRequest);

    expect(errorPresenterSpy).toHaveBeenCalled();
  });
});
