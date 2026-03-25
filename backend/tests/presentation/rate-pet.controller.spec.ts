import { AppError } from "@application/errors/app-error";
import { RatePetController } from "@presentation/controllers/rate-pet.controller";
import { describe, expect, it, vi } from "vitest";
import { RatePetUseCaseStub } from "./doubles/rate-pet.usecase.stub";
import { RatePetValidatorStub } from "./doubles/rate-pet.validator.stub";

describe("RatePetController", () => {
  const makeSut = () => {
    const httpValidatorStub = new RatePetValidatorStub();
    const ratePetUseCaseStub = new RatePetUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const ratePetUseCaseSpy = vi.spyOn(ratePetUseCaseStub, "execute");
    const sut = new RatePetController(httpValidatorStub, ratePetUseCaseStub);
    return { sut, httpValidatorSpy, ratePetUseCaseSpy };
  };

  const dummyRequest = {
    params: {
      id: "valid_pet_id",
    },
    body: {
      rate: "majestic",
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

  it("Should call RatePet use case with correct values", async () => {
    const { sut, ratePetUseCaseSpy } = makeSut();

    await sut.handle(dummyRequest);

    expect(ratePetUseCaseSpy).toHaveBeenCalledWith({
      petId: "valid_pet_id",
      userId: "valid_user_id",
      rate: "majestic",
    });
  });

  it("Should return 200 with rate data on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
      petId: "valid_pet_id",
      rate: "majestic",
    });
  });

  it("Should return 400 if HttpValidator returns an INVALID_PARAM error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("INVALID_PARAM", "rate");
    });

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Invalid Param: rate");
  });
});
