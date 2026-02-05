import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { UnlikePostDTO } from "@domain/usecases/unlike-post.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";

export class UnlikePostValidatorStub implements HttpValidator<UnlikePostDTO> {
  execute(request: HttpRequest): UnlikePostDTO {
    request.body = {
      post_id: "valid_post_id",
      user_id: "authenticated_user_id",
    };
    return request.body as UnlikePostDTO;
  }
}
