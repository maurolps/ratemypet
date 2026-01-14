import type { ImageCompressor } from "@application/ports/image-compressor.contract";

export class ImageCompressorStub implements ImageCompressor {
  async compress(_imageBuffer: Buffer): Promise<Buffer> {
    return Buffer.from("compressed_image_buffer");
  }
}
