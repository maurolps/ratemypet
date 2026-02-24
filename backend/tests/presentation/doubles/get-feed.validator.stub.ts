import type { GetFeedDTO } from "@domain/usecases/get-feed.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import { FIXED_DATE } from "../../config/constants";

export class GetFeedValidatorStub implements HttpValidator<GetFeedDTO> {
  execute(request: HttpRequest): GetFeedDTO {
    request.body = {
      viewer_id: "valid_viewer_id",
      limit: 20,
      cursor: {
        created_at: FIXED_DATE,
        id: "valid_cursor_id",
      },
    };

    return request.body as GetFeedDTO;
  }
}
