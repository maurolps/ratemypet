import type { FindUserByEmailRepository } from "@application/repositories/find-user-by-email.repository";
import type { Hasher } from "@application/ports/hasher.contract";
import type { User } from "@domain/entities/user";
import type {
  CreateUser,
  CreateUserDTO,
} from "@domain/usecases/create-user.contract";
import { AppError } from "@presentation/errors/app-error";

export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly findUserByEmail: FindUserByEmailRepository,
    private readonly hashPassword: Hasher,
  ) {}

  async execute(userDTO: CreateUserDTO): Promise<User> {
    const userExists = await this.findUserByEmail.perform(userDTO.email);

    if (userExists) {
      throw new AppError("EMAIL_TAKEN");
    }

    const _hashedPassword = this.hashPassword.execute(userDTO.password);

    return {
      id: "any_id",
      name: userDTO.name,
      email: userDTO.email,
    };
  }
}
