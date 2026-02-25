import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { DeletePostDTO } from "@domain/usecases/delete-post.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";

export class DeletePostValidatorStub implements HttpValidator<DeletePostDTO> {
  execute(request: HttpRequest): DeletePostDTO {
    request.body = {
      post_id: "valid_post_id",
      user_id: "authenticated_user_id",
    };
    return request.body as DeletePostDTO;
  }
}
