import type { PetStorage } from "@application/ports/pet-storage.contract";
import type { PetImage } from "@domain/entities/pet";
import {
  type S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { env } from "@main/config/env";

export class S3PetStorageAdapter implements PetStorage {
  constructor(private readonly s3Client: S3Client) {}

  async upload(image: PetImage): Promise<string> {
    const uploadParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: `${Date.now()}-${image.originalName}`,
      Body: image.buffer,
      ContentType: image.mimeType,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
    } catch (error) {
      throw new Error("S3Client Error", { cause: error });
    }

    const imageUrl = `${env.AWS_ENDPOINT}/${env.AWS_BUCKET_NAME}/${uploadParams.Key}`;
    return imageUrl;
  }

  async delete(imageUrl: string): Promise<void> {
    const url = new URL(imageUrl);
    const key = url.pathname.replace(`/${env.AWS_BUCKET_NAME}/`, "");

    const deleteParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
    };

    try {
      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      throw new Error("S3Client Error", { cause: error });
    }
  }
}
