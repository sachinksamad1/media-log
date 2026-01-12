import path from 'path';

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
    // 1. Generate unique path: anime/uuid.jpg
    const extension = path.extname(file.originalname);
    const fileName = `${folder}/${uuidv4()}${extension}`;
    const blob = this.bucket.file(fileName);

    // 2. Stream the buffer to FireStorage
    await blob.save(file.buffer, {
      contentType: file.mimetype,
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
      console.error('Failed to delete image from storage:', error);
      // We don't throw here to ensure the DB record is still deleted
    }
  }
}
