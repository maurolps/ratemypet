import type {
  GetMe,
  GetMeDTO,
  GetMeResult,
} from "@domain/usecases/get-me.contract";

export class GetMeUseCaseStub implements GetMe {
  async execute(_: GetMeDTO): Promise<GetMeResult> {
    return {
      id: "valid_user_id",
      displayName: "valid_display_name",
      email: "valid_email@mail.com",
      bio: "Pet lover 🐶",
      picture: "https://valid.picture/me.png",
      stats: {
        postsCount: 2,
        likesReceived: 7,
      },
      pets: [
        {
          id: "valid_pet_id",
          name: "valid_pet_name",
          type: "dog",
          imageUrl: "https://valid.image/pet.png",
        },
      ],
    };
  }
}
