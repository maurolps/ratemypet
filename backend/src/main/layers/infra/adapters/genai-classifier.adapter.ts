import type { PetClassifier } from "@application/ports/pet-classifier.contract";
import type { ClassifiedPet } from "@domain/entities/pet";
import type { UploadPetDTO } from "@domain/usecases/upload-pet.contract";
import type { GoogleGenAI } from "@google/genai";

type AiResponse = {
  isValidPet: boolean;
  petType: "dog" | "cat" | null;
  caption: string;
};

export class GenAiClassiferAdapter implements PetClassifier {
  constructor(private readonly ai: GoogleGenAI) {}

  async classify(petDTO: UploadPetDTO): Promise<ClassifiedPet | null> {
    const prompt = `
You are an expert pet image classifier.

Analyze the image and return ONLY a valid JSON object with the following shape:

{
  "isValidPet": boolean,
  "petType": "dog" | "cat" | null,
  "caption": string
}

Rules:
- isValidPet must be false if the image is not a dog or a cat
- petType must be null if isValidPet is false
- caption must be a short, funny sentence related to the pet
- DO NOT return markdown
- DO NOT add explanations
`;

    const imagePart = {
      inlineData: {
        data: petDTO.image.buffer.toString("base64"),
        mimeType: petDTO.image.mimeType,
      },
    };

    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: [imagePart, { text: prompt }],
    });

    const classifiedPet = this.parseAiResponse(response.text ?? "null");

    return classifiedPet;
  }

  private validatePayload(aiResponse: AiResponse): boolean {
    const validPetTypes = ["dog", "cat", null];
    if (typeof aiResponse.isValidPet !== "boolean") {
      return false;
    }
    if (!validPetTypes.includes(aiResponse.petType)) {
      return false;
    }
    if (typeof aiResponse.caption !== "string") {
      return false;
    }
    return true;
  }

  private parseAiResponse(responseText: string): ClassifiedPet | null {
    let aiResponse: AiResponse;
    try {
      aiResponse = JSON.parse(responseText);
    } catch {
      throw new Error("Invalid JSON response from AI");
    }
    if (!this.validatePayload(aiResponse)) {
      throw new Error("Invalid payload response from AI");
    }

    if (aiResponse.isValidPet === false) {
      return null;
    }

    if (aiResponse.petType === null) {
      return null;
    }

    const classifiedPet: ClassifiedPet = {
      type: aiResponse.petType,
      caption: aiResponse.caption,
    };

    return classifiedPet;
  }
}
