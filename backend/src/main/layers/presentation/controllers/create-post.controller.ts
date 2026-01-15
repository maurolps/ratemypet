import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type {
  CreatePost,
  CreatePostDTO,
} from "@domain/usecases/create-post.contract";

export class CreatePostController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<CreatePostDTO>,
    private readonly createPost: CreatePost,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const postDTO = this.httpValidator.execute(request);
    const post = await this.createPost.execute(postDTO);
    return {
      status: 200,
      body: post,
    };
  }
}
