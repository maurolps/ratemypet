import { vi, it, describe, expect } from "vitest";
import { googleGenAiStub } from "./doubles/genai.stub";

import { GenAiClassiferAdapter } from "@infra/adapters/genai-classifier.adapter";

describe("GenAiClassifer Adapter", () => {
  const sut = new GenAiClassiferAdapter(googleGenAiStub);
  const googleGenAiSpy = vi.spyOn(googleGenAiStub.models, "generateContent");

  const validPetDTO = {
    petName: "any_pet_name",
    userId: "any_user_id",
    image: {
      originalName: "any_image_name",
      mimeType: "valid/mime-type",
      buffer: Buffer.from("any_image_buffer"),
    },
  };

  it("Should call GoogleGenAI once", async () => {
    await sut.classify(validPetDTO);
    expect(googleGenAiSpy).toHaveBeenCalledTimes(1);
  });

  it("Should throw if GenAI returns an invalid response", async () => {
    googleGenAiSpy.mockResolvedValueOnce({
      text: `
        INVALID RESPONSE
      `,
    });
    const promise = sut.classify(validPetDTO);
    await expect(promise).rejects.toThrowError("Invalid JSON response from AI");
  });
});
