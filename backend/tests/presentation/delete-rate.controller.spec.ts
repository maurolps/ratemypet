import { DeleteRateController } from "@presentation/controllers/delete-rate.controller";
import { describe, expect, it, vi } from "vitest";
import { DeleteRateUseCaseStub } from "./doubles/delete-rate.usecase.stub";
import { DeleteRateValidatorStub } from "./doubles/delete-rate.validator.stub";

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

describe("DeleteRateController", () => {
  const makeSut = () => {
    const httpValidatorStub = new DeleteRateValidatorStub();
    const deleteRateUseCaseStub = new DeleteRateUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const deleteRateUseCaseSpy = vi.spyOn(deleteRateUseCaseStub, "execute");
    const sut = new DeleteRateController(
      httpValidatorStub,
      deleteRateUseCaseStub,
    );

    return { sut, httpValidatorSpy, deleteRateUseCaseSpy };
  };

  const dummyRequest = {
    params: {
      id: "valid_pet_id",
    },
    user: {
      sub: "valid_user_id",
      name: "authenticated_user_name",
      email: "authenticated_user_email",
    },
  };

  it("Should call HttpValidator with correct values", async () => {
    const { sut, httpValidatorSpy } = makeSut();

    await sut.handle(dummyRequest);

    expect(httpValidatorSpy).toHaveBeenCalledWith(dummyRequest);
  });

  it("Should call DeleteRate use case with correct values", async () => {
    const { sut, deleteRateUseCaseSpy } = makeSut();

    await sut.handle(dummyRequest);

    expect(deleteRateUseCaseSpy).toHaveBeenCalledWith({
      petId: "valid_pet_id",
      userId: "valid_user_id",
    });
  });

  it("Should return 200 with delete status on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
      petId: "valid_pet_id",
      status: "deleted",
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
