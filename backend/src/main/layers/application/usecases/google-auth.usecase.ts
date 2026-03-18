import type {
  GoogleIdentity,
  GoogleTokenVerifier,
} from "@application/ports/google-token-verifier.contract";
import type { AuthIdentityRepository } from "@application/repositories/auth-identity-repository";
import type { CreateUserRepository } from "@application/repositories/create-user.repository";
import type { FindUserRepository } from "@application/repositories/find-user.repository";
import type { UnitOfWork } from "@application/ports/unit-of-work.contract";
import type { TokenIssuer } from "@domain/entities/token";
import type {
  GoogleAuth,
  GoogleAuthDTO,
} from "@domain/usecases/google-auth.contract";
import type { LoggedUser } from "@domain/usecases/login.contract";
import { AppError } from "@application/errors/app-error";
import { makeDefaultUserProfile } from "@application/helpers/default-user-profile";
import { toUserResponse } from "@application/helpers/to-user-response";

export class GoogleAuthUseCase implements GoogleAuth {
  constructor(
    private readonly googleTokenVerifier: GoogleTokenVerifier,
    private readonly findUser: FindUserRepository,
    private readonly createUserRepository: CreateUserRepository,
    private readonly authIdentityRepository: AuthIdentityRepository,
    private readonly tokenIssuer: TokenIssuer,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async auth(googleAuthDTO: GoogleAuthDTO): Promise<LoggedUser> {
    let googleIdentity: GoogleIdentity;

    try {
      googleIdentity = await this.googleTokenVerifier.verify(
        googleAuthDTO.id_token,
      );
    } catch {
      throw new AppError("UNAUTHORIZED");
    }

    if (!googleIdentity.email_verified) {
      throw new AppError("UNAUTHORIZED");
    }

    const authIdentity = await this.authIdentityRepository.findByProviderUserId(
      "google",
      googleIdentity.sub,
    );
    const defaultUserProfile = makeDefaultUserProfile(googleIdentity.name);

    const user = authIdentity
      ? await this.findUser.findById(authIdentity.user_id)
      : await this.unitOfWork.execute(async (transaction) => {
          const createdUser = await this.createUserRepository.create(
            {
              name: googleIdentity.name,
              email: googleIdentity.email,
              picture: googleIdentity.picture ?? null,
              displayName: defaultUserProfile.displayName,
              bio: defaultUserProfile.bio,
            },
            transaction,
          );

          await this.authIdentityRepository.create(
            {
              user_id: createdUser.id,
              provider: "google",
              identifier: googleIdentity.email,
              provider_user_id: googleIdentity.sub,
              password_hash: null,
            },
            transaction,
          );

          return createdUser;
        });

    if (!user) {
      throw new AppError("UNAUTHORIZED");
    }

    const tokens = await this.tokenIssuer.execute(user);

    return {
      ...toUserResponse(user),
      tokens,
    };
  }
}
