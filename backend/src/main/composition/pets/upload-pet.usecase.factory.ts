import { UploadPetUseCase } from "@application/usecases/upload-pet.usecase";
import { GenAiClassiferAdapter } from "@infra/adapters/genai-classifier.adapter";
import { S3PetStorageAdapter } from "@infra/adapters/s3-pet-storage.adapter";
import { SharpCompressorAdapter } from "@infra/adapters/sharp-compressor.adapter";
import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@main/config/env";
import { GoogleGenAI } from "@google/genai";
import { PgPetRepository } from "@infra/db/postgres/pg-pet.repository";

export const makeUploadPetUseCase = () => {
  const s3Client = new S3Client({
    region: env.AWS_REGION,
    endpoint: env.AWS_ENDPOINT,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const googleGenAi = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  const imageCompressor = new SharpCompressorAdapter();
  const petClassifier = new GenAiClassiferAdapter(googleGenAi);
  const petStorage = new S3PetStorageAdapter(s3Client);
  const petRepository = new PgPetRepository();
  const usecase = new UploadPetUseCase(
    imageCompressor,
    petClassifier,
    petStorage,
    petRepository,
  );

  return usecase;
};
