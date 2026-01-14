import type { ImageCompressor } from "@application/ports/image-compressor.contract";
import sharp from "sharp";

export class SharpCompressorAdapter implements ImageCompressor {
  async compress(imageBuffer: Buffer): Promise<Buffer> {
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 800 })
      .webp({ quality: 80 })
      .toBuffer();
    return compressedImageBuffer;
  }
}
