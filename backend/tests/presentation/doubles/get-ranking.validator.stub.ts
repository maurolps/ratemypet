import type { GetRankingDTO } from "@domain/usecases/get-ranking.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export class GetRankingValidatorStub implements HttpValidator<GetRankingDTO> {
  execute(request: HttpRequest): GetRankingDTO {
    request.body = {
      type: "dog",
    };

    return request.body as GetRankingDTO;
  }
}
