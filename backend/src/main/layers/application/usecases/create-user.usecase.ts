import type { FindUserRepository } from "@application/repositories/find-user.repository";
import type { Hasher } from "@application/ports/hasher.contract";
import type { User } from "@domain/entities/user";
import type { CreateUserRepository } from "@application/repositories/create-user.repository";
import type {
  CreateUser,
  CreateUserDTO,
} from "@domain/usecases/create-user.contract";
import { AppError } from "@application/errors/app-error";

export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly findUser: FindUserRepository,
    private readonly hashPassword: Hasher,
    private readonly createUserRepository: CreateUserRepository,
  ) {}

  async execute(userDTO: CreateUserDTO): Promise<User> {
    const userExists = await this.findUser.findByEmail(userDTO.email);

    if (userExists) {
      throw new AppError("EMAIL_TAKEN");
    }

    const hashedPassword = await this.hashPassword.hash(userDTO.password);
    const user = await this.createUserRepository.create({
      ...userDTO,
      password: hashedPassword,
    });

    return user;
  }
}
