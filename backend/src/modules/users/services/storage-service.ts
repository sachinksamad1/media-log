import { v4 as uuidv4 } from 'uuid';

import { storage } from '../../../config/firebase.js';

export class StorageService {
  /**
   * Uploads a file to Firebase Storage and returns the signed URL.
   * stored in: users/{uid}/avatar/{filename}
   */
  async uploadAvatar(uid: string, file: Express.Multer.File): Promise<string> {
    const bucket = storage.bucket();
    const extension = file.originalname.split('.').pop() || 'jpg';
    const filename = `users/${uid}/avatar/${uuidv4()}.${extension}`;
    const fileRef = bucket.file(filename);

    await fileRef.save(file.buffer, {
      contentType: file.mimetype,
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
