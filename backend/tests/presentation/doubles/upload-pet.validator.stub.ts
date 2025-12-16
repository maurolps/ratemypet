import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { UploadPetDTO } from "@domain/usecases/upload-pet.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";

export class UploadPetValidatorStub implements HttpValidator<UploadPetDTO> {
  execute(request: HttpRequest): UploadPetDTO {
    request.body = {
      name: "valid_pet_name",
      userId: "valid_user_id",
      image: {
        originalName: "valid_image_name",
        mimeType: "valid/mime-type",
        buffer: Buffer.from("any_image_buffer"),
      },
    };
    return request.body as UploadPetDTO;
  }
}
