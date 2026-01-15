import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { CreatePostDTO } from "@domain/usecases/create-post.contract";

export class CreatePostController implements Controller {
  constructor(private readonly httpValidator: HttpValidator<CreatePostDTO>) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const _postDTO = this.httpValidator.execute(request);
    return {
      status: 200,
      body: {
        message: "Post created",
      },
    };
  }
}
