export interface ImageCompressor {
  compress(imageBuffer: Buffer): Promise<Buffer>;
}
