import sharp from "sharp";
import { SharpCompressorAdapter } from "@infra/adapters/sharp-compressor.adapter";
import { vi, it, describe, expect } from "vitest";

describe("SharpCompressor Adapter", () => {
  vi.mock("sharp", () => {
    return {
      default: vi.fn(() => ({
        resize: vi.fn().mockReturnThis(),
        webp: vi.fn().mockReturnThis(),
        toBuffer: vi.fn().mockResolvedValue(Buffer.from("compressed_image")),
      })),
    };
  });
  const sut = new SharpCompressorAdapter();
  const imageBuffer = Buffer.from("any_image_buffer");

  it("Should call Sharp with correct buffer", async () => {
    await sut.compress(imageBuffer);
    expect(sharp).toHaveBeenCalledWith(imageBuffer);
  });
});
