import { describe, expect, it, vi } from "vitest";
import { UpdateProfileController } from "@presentation/controllers/update-profile.controller";
import { UpdateProfileUseCaseStub } from "./doubles/update-profile.usecase.stub";
import { UpdateProfileValidatorStub } from "./doubles/update-profile.validator.stub";

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

describe("UpdateProfileController", () => {
  const makeSut = () => {
    const httpValidatorStub = new UpdateProfileValidatorStub();
    const updateProfileUseCaseStub = new UpdateProfileUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const updateProfileUseCaseSpy = vi.spyOn(
      updateProfileUseCaseStub,
      "execute",
    );
    const sut = new UpdateProfileController(
      httpValidatorStub,
      updateProfileUseCaseStub,
    );

    return {
      sut,
      httpValidatorSpy,
      updateProfileUseCaseSpy,
    };
  };

  const dummyRequest = {
    body: {
      displayName: "updated_display_name",
      bio: "updated_bio",
    },
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

  it("Should call UpdateProfile use case with correct values", async () => {
    const { sut, updateProfileUseCaseSpy } = makeSut();

    await sut.handle(dummyRequest);

    expect(updateProfileUseCaseSpy).toHaveBeenCalledWith({
      user_id: "valid_user_id",
      displayName: "updated_display_name",
      bio: "updated_bio",
    });
  });

  it("Should return 200 with updated profile data on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "valid_user_id",
      displayName: "updated_display_name",
      bio: "updated_bio",
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
