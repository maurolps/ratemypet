import type { GetPostDTO } from "@domain/usecases/get-post.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export class GetPostValidatorStub implements HttpValidator<GetPostDTO> {
  execute(request: HttpRequest): GetPostDTO {
    request.body = {
      post_id: "valid_post_id",
      viewer_id: "valid_viewer_id",
      limit: 20,
    };

    return request.body as GetPostDTO;
  }
}
