import type { AuthIdentityRepository } from "@application/repositories/auth-identity-repository";
import type { UnitOfWork } from "@application/ports/unit-of-work.contract";
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
    private readonly authIdentityRepository: AuthIdentityRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(userDTO: CreateUserDTO): Promise<User> {
    const userExists = await this.findUser.findByEmail(userDTO.email);

    if (userExists) {
      throw new AppError("EMAIL_TAKEN");
    }

    const hashedPassword = await this.hashPassword.hash(userDTO.password);

    const user = await this.unitOfWork.execute(async (transaction) => {
      const createdUser = await this.createUserRepository.create(
        {
          name: userDTO.name,
          email: userDTO.email,
        },
        transaction,
      );

      await this.authIdentityRepository.create(
        {
          user_id: createdUser.id,
          provider: "local",
          password_hash: hashedPassword,
          provider_user_id: null,
        },
        transaction,
      );

      return createdUser;
    });

    return user;
  }
}
