import type { UpdateProfileDTO } from "@domain/usecases/update-profile.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export class UpdateProfileValidatorStub
  implements HttpValidator<UpdateProfileDTO>
{
  execute(request: HttpRequest): UpdateProfileDTO {
    request.body = {
      user_id: "valid_user_id",
      displayName: "updated_display_name",
      bio: "updated_bio",
    };

    return request.body as UpdateProfileDTO;
  }
}
