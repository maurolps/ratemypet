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

  it("Should throw if AI response contains invalid petType", async () => {
    googleGenAiSpy.mockResolvedValueOnce({
      text: `
        {
          "isValidPet": true,
          "petType": "LIZARD",
          "caption": "A funny caption"
        }
      `,
    });
    const promise = sut.classify(validPetDTO);
    await expect(promise).rejects.toThrowError(
      "Invalid payload response from AI",
    );
  });

  it("Should throw if AI response contains invalid isValidPet", async () => {
    googleGenAiSpy.mockResolvedValueOnce({
      text: `
        {
          "isValidPet": 1,
          "petType": "dog",
          "caption": "A funny caption"
        }
      `,
    });
    const promise = sut.classify(validPetDTO);
    await expect(promise).rejects.toThrowError(
      "Invalid payload response from AI",
    );
  });

  it("Should throw if AI response contains invalid caption", async () => {
    googleGenAiSpy.mockResolvedValueOnce({
      text: `
        {
          "isValidPet": true,
          "petType": "dog",
          "caption": 123
        }
      `,
    });
    const promise = sut.classify(validPetDTO);
    await expect(promise).rejects.toThrowError(
      "Invalid payload response from AI",
    );
  });

  it("Should return null if AI says isValidPet is false", async () => {
    googleGenAiSpy.mockResolvedValueOnce({
      text: `
        {
          "isValidPet": false,
          "petType": null,
          "caption": "A funny caption"
        }
      `,
    });
    const classifiedPet = await sut.classify(validPetDTO);
    expect(classifiedPet).toBeNull();
  });

  it("Should return null if AI says petType is null", async () => {
    googleGenAiSpy.mockResolvedValueOnce({
      text: `
        {
          "isValidPet": true,
          "petType": null,
          "caption": "A funny caption"
        }
      `,
    });
    const classifiedPet = await sut.classify(validPetDTO);
    expect(classifiedPet).toBeNull();
  });

  it("Should return a ClassifiedPet on success", async () => {
    const classifiedPet = await sut.classify(validPetDTO);
    expect(classifiedPet).toEqual({
      type: "dog",
      caption: "A happy dog following the happy path.",
    });
  });
});
