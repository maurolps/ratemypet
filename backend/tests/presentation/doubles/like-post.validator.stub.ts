import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { LikePostDTO } from "@domain/usecases/like-post.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";

export class LikePostValidatorStub implements HttpValidator<LikePostDTO> {
  execute(request: HttpRequest): LikePostDTO {
    request.body = {
      post_id: "valid_post_id",
      user_id: "valid_user_id",
    };
    return request.body as LikePostDTO;
  }
}
