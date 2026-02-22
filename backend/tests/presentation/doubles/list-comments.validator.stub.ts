import type { ListCommentsDTO } from "@domain/usecases/list-comments.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import { FIXED_DATE } from "../../config/constants";

export class ListCommentsValidatorStub
  implements HttpValidator<ListCommentsDTO>
{
  execute(request: HttpRequest): ListCommentsDTO {
    request.body = {
      post_id: "valid_post_id",
      limit: 20,
      cursor: {
        created_at: FIXED_DATE,
        id: "valid_cursor_id",
      },
    };

    return request.body as ListCommentsDTO;
  }
}
