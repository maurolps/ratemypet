import { describe, expect, it, vi } from "vitest";
import { AppError } from "@application/errors/app-error";
import { DeletePetController } from "@presentation/controllers/delete-pet.controller";
import { DeletePetUseCaseStub } from "./doubles/delete-pet.usecase.stub";
import { DeletePetValidatorStub } from "./doubles/delete-pet.validator.stub";

describe("DeletePetController", () => {
  const makeSut = () => {
    const httpValidatorStub = new DeletePetValidatorStub();
    const deletePetUseCaseStub = new DeletePetUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const deletePetUseCaseSpy = vi.spyOn(deletePetUseCaseStub, "execute");
    const sut = new DeletePetController(
      httpValidatorStub,
      deletePetUseCaseStub,
    );
    return { sut, httpValidatorSpy, deletePetUseCaseSpy };
  };

  const dummyRequest = {
    params: {
      id: "valid_pet_id",
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

  it("Should call DeletePet use case with correct values", async () => {
    const { sut, deletePetUseCaseSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(deletePetUseCaseSpy).toHaveBeenCalledWith({
      pet_id: "valid_pet_id",
      user_id: "authenticated_user_id",
    });
  });

  it("Should return 400 if HttpValidator returns a MISSING_PARAM error", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("MISSING_PARAM", "id");
    });

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Missing Param: id");
  });

  it("Should return 204 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(204);
    expect(httpResponse.body).toEqual({});
  });
});
