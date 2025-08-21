import type { User } from "../../domain/entities/user";
import type {
  CreateUser,
  CreateUserDTO,
} from "../../domain/usecases/create-user";
import { CreateUserController } from "./create-user.controller";

class CreateUserStub implements CreateUser {
  async execute(user: CreateUserDTO): Promise<User> {
    return {
      id: "valid_id",
      name: user.name,
      email: user.email,
    };
  }
}

const makeSut = () => {
  const createUserStub = new CreateUserStub();
  const sut = new CreateUserController(createUserStub);
  return { sut, createUserStub };
};

describe("CreateUserController", () => {
  it("Should return 201 when user is created successfully", async () => {
    const { sut } = makeSut();
    const dummyRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
      },
    };

    const httpResponse = await sut.handle(dummyRequest);

    expect(httpResponse.status).toBe(201);
  });

  it("Should call CreateUser usecase with correct values", async () => {
    const { sut, createUserStub } = makeSut();
    const createUserSpy = vi.spyOn(createUserStub, "execute");
    const dummyRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };

    await sut.handle(dummyRequest);

    expect(createUserSpy).toHaveBeenCalledWith({
      name: dummyRequest.body.name,
      email: dummyRequest.body.email,
      password: dummyRequest.body.password,
    });
  });
});
