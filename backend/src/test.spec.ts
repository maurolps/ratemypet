import helloWorld from "./test";

describe("Vitest monorepo config test", () => {
  it("should return the world", () => {
    expect(helloWorld("Earth")).toBe("Earth");
  });
});
