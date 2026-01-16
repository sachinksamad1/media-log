import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { storage } from '../../config/firebase.js';

export class StorageHelper {
  private static bucket = storage.bucket();

  /**
   * Universal upload handler for any media type
   */
  static async uploadMediaImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    // 1. Convert image to WebP using Sharp
    const webpBuffer = await sharp(file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    // 2. Generate unique path: anime/uuid.webp
    const fileName = `${folder}/${uuidv4()}.webp`;
    const blob = this.bucket.file(fileName);

    // 3. Stream the buffer to FireStorage
    await blob.save(webpBuffer, {
      contentType: 'image/webp',
      public: true, // Generate public URL for frontend use
    });

    return blob.publicUrl();
  }

  /**
   * Deletes an image from storage when a record is removed
   */
  static async deleteMediaImage(imageUrl: string): Promise<void> {
    if (!imageUrl) return;

    try {
      // Extract the path from the public URL
      const pathPart = imageUrl.split('/').pop();
      if (pathPart) {
        const file = this.bucket.file(decodeURIComponent(pathPart));
        await file.delete();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete image from storage:', error);
      // We don't throw here to ensure the DB record is still deleted
    }
  }
}
