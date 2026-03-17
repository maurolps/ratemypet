import type { AuthIdentityRepository } from "@application/repositories/auth-identity-repository";
import type { UnitOfWork } from "@application/ports/unit-of-work.contract";
import type { Hasher } from "@application/ports/hasher.contract";
import type { User } from "@domain/entities/user";
import type { CreateUserRepository } from "@application/repositories/create-user.repository";
import type {
  CreateUser,
  CreateUserDTO,
} from "@domain/usecases/create-user.contract";
import { AppError } from "@application/errors/app-error";
import { makeDefaultUserProfile } from "@application/services/default-user-profile";

export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly hashPassword: Hasher,
    private readonly createUserRepository: CreateUserRepository,
    private readonly authIdentityRepository: AuthIdentityRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(userDTO: CreateUserDTO): Promise<User> {
    const authIdentityExists =
      await this.authIdentityRepository.findByProviderAndIdentifier(
        "local",
        userDTO.email,
      );

    if (authIdentityExists) {
      throw new AppError("EMAIL_TAKEN");
    }

    const hashedPassword = await this.hashPassword.hash(userDTO.password);
    const defaultUserProfile = makeDefaultUserProfile(userDTO.name);

    const user = await this.unitOfWork.execute(async (transaction) => {
      const createdUser = await this.createUserRepository.create(
        {
          name: userDTO.name,
          email: userDTO.email,
          display_name: defaultUserProfile.display_name,
          bio: defaultUserProfile.bio,
        },
        transaction,
      );

      await this.authIdentityRepository.create(
        {
          user_id: createdUser.id,
          provider: "local",
          identifier: userDTO.email,
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
