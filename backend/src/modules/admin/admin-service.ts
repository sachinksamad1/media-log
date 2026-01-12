import { AppError } from '../../common/errors/app-error.js';
import { db, storage } from '../../config/firebase.js';

export interface CleanupResult {
  collection: string;
  deleted: number;
  failed: number;
}

export class AdminService {
  private readonly bucket = storage.bucket();

  async cleanupOrphanedImages(collectionName: string): Promise<CleanupResult> {
    try {
      const [files] = await this.bucket.getFiles({
        prefix: `${collectionName}/`,
      });

      let deleted = 0;
      let failed = 0;

      await Promise.all(
        files.map(async (file) => {
          try {
            const fileUrl = file.publicUrl();

            const snapshot = await db
              .collection(collectionName)
              .where('imageUrl', '==', fileUrl)
              .limit(1)
              .get();

            if (snapshot.empty) {
              await file.delete();
              deleted++;
            }
          } catch {
            failed++;
          }
        }),
      );

      return { collection: collectionName, deleted, failed };
    } catch (error) {
      throw new AppError(
        `Cleanup failed for collection '${collectionName}'`,
        500,
      );
    }
  }

  async runFullSystemCleanup(): Promise<CleanupResult[]> {
    const collections = [
      'anime',
      'manga',
      'fiction',
      'non-fiction',
      'games',
      'movies',
      'tv-series',
      'light-novels',
    ];

    return Promise.all(
      collections.map((col) => this.cleanupOrphanedImages(col)),
    );
  }
}
