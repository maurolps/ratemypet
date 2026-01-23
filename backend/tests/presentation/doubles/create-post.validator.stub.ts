import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { CreatePostDTO } from "@domain/usecases/create-post.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";

export class CreatePostValidatorStub implements HttpValidator<CreatePostDTO> {
  execute(request: HttpRequest): CreatePostDTO {
    request.body = {
      pet_id: "valid_pet_id",
      author_id: "valid_author_id",
      caption: "valid_caption",
    };
    return request.body as CreatePostDTO;
  }
}
