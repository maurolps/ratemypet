import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type {
  CreatePost,
  CreatePostDTO,
} from "@domain/usecases/create-post.contract";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class CreatePostController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<CreatePostDTO>,
    private readonly createPost: CreatePost,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const postDTO = this.httpValidator.execute(request);
      const post = await this.createPost.execute(postDTO);
      return ok(post);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
