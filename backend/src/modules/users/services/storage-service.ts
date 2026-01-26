import { promises as fs } from 'fs';

import { v4 as uuidv4 } from 'uuid';

import { storage } from '../../../config/firebase.js';

import type { UploadedFile } from '@/common/types/file-types.js';

export class StorageService {
  /**
   * Uploads a file to Firebase Storage and returns the signed URL.
   * stored in: users/{uid}/avatar/{filename}
   */
  async uploadAvatar(uid: string, file: UploadedFile): Promise<string> {
    const bucket = storage.bucket();
    const extension =
      (file.originalFilename || 'image.jpg').split('.').pop() || 'jpg';
    const filename = `users/${uid}/avatar/${uuidv4()}.${extension}`;
    const fileRef = bucket.file(filename);

    const buffer = await fs.readFile(file.filepath);

    await fileRef.save(buffer, {
      contentType: file.mimetype || 'image/jpeg',
      public: true, // Make strictly public if you want standard HTTP URLs, or we can use signed URLs
    });

    // Make the file public and get the public URL (if bucket permissions allow)
    // Or we can simple construct the URL if we know it is public
    // format: https://storage.googleapis.com/{bucket}/{filename}
    // But for Firebase, often we use the download token or just make it public.

    // Attempting to make it public explicitly
    await fileRef.makePublic();

    // Construct public URL
    // https://storage.googleapis.com/BUCKET_NAME/PATH/TO/FILE
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    return publicUrl;
  }
}

export const storageService = new StorageService();
