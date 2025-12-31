import { s3ClientStub } from "./doubles/s3-client.stub";
import { vi, it, describe, expect, afterEach } from "vitest";
import { S3PetStorageAdapter } from "@infra/adapters/s3-pet-storage.adapter";

describe("S3PetStorage Adapter", () => {
  const sut = new S3PetStorageAdapter(s3ClientStub);
  const s3ClientSpy = vi.spyOn(s3ClientStub, "send");

  const validPetImage = {
    originalName: "any_image_name",
    mimeType: "valid/mime-type",
    buffer: Buffer.from("any_image_buffer"),
  };

  afterEach(() => {
    s3ClientSpy.mockClear();
  });

  it("Should call S3Client once on upload", async () => {
    await sut.upload(validPetImage);
    expect(s3ClientSpy).toHaveBeenCalledTimes(1);
  });

  it("Should call S3Client once on delete", async () => {
    const imageUrl = "https://any-endpoint/any-bucket-name/any_image_name";
    await sut.delete(imageUrl);
    expect(s3ClientSpy).toHaveBeenCalledTimes(1);
  });

  it("Should rethrow if S3Client throws", async () => {
    s3ClientSpy.mockRejectedValueOnce(new Error("any_error"));
    const promise = sut.upload(validPetImage);
    await expect(promise).rejects.toThrowError("S3Client Error");
    expect(promise).rejects.toHaveProperty("cause");
  });
});
