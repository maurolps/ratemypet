import { CreateUserController } from "./create-user.controller";

describe("CreateUserController", () => {
  it("Should return 201 when user is created successfully", async () => {
    const sut = new CreateUserController();
    const dummyRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        confirmPassword: "valid_password",
      },
    };
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(201);
  });
});
