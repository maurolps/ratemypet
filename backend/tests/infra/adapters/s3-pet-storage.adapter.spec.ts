import { s3ClientStub } from "./doubles/s3-client.stub";
import { vi, it, describe, expect } from "vitest";
import { S3PetStorageAdapter } from "@infra/adapters/s3-pet-storage.adapter";

describe("S3PetStorage Adapter", () => {
  const sut = new S3PetStorageAdapter(s3ClientStub);
  const s3ClientSpy = vi.spyOn(s3ClientStub, "send");

  const validPetImage = {
    originalName: "any_image_name",
    mimeType: "valid/mime-type",
    buffer: Buffer.from("any_image_buffer"),
  };

  it("Should call S3Client once on upload", async () => {
    await sut.upload(validPetImage);
    expect(s3ClientSpy).toHaveBeenCalledTimes(1);
  });
});
