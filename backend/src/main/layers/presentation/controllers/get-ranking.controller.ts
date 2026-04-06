import type {
  GetRanking,
  GetRankingDTO,
} from "@domain/usecases/get-ranking.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class GetRankingController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<GetRankingDTO>,
    private readonly getRanking: GetRanking,
  ) {}
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const getRankingDTO = this.httpValidator.execute(request);
      const result = await this.getRanking.execute(getRankingDTO);
      return ok(result);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
