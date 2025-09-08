import type { FindUserByEmailRepository } from "@application/repositories/find-user-by-email.repository";
import type { Hasher } from "@application/ports/hasher.contract";
import type { User } from "@domain/entities/user";
import type { CreateUserRepository } from "@application/repositories/create-user.repository";
import type {
  CreateUser,
  CreateUserDTO,
} from "@domain/usecases/create-user.contract";
import { AppError } from "@presentation/errors/app-error";

export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly findUserByEmail: FindUserByEmailRepository,
    private readonly hashPassword: Hasher,
    private readonly createUserRepository: CreateUserRepository,
  ) {}

  async execute(userDTO: CreateUserDTO): Promise<User> {
    const userExists = await this.findUserByEmail.perform(userDTO.email);

    if (userExists) {
      throw new AppError("EMAIL_TAKEN");
    }

    const hashedPassword = this.hashPassword.execute(userDTO.password);
    const user = await this.createUserRepository.perform({
      ...userDTO,
      password: hashedPassword,
    });

    return user;
  }
}
