export const googleGenAiStub = {
  models: {
    generateContent: async (_params: unknown) => {
      return {
        text: JSON.stringify({
          isValidPet: true,
          petType: "dog",
          caption: "A happy dog following the happy path.",
        }),
      };
    },
  },
  // biome-ignore lint: no-explicit-any
} as any;
