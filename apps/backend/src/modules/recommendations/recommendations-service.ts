import { db } from '@config/firebase.js';
import type { MediaBase } from '@media-log/shared-types';
import * as tf from '@tensorflow/tfjs';

const MEDIA_COLLECTIONS = [
  'anime',
  'manga',
  'fiction',
  'light_novel',
  'non_fiction',
  'movie',
  'tv_series',
  'game',
];

export class RecommendationsService {
  /**
   * Fetches content-based recommendations for a user.
   */
  async getRecommendations(
    userId: string,
    limitCount: number = 10,
  ): Promise<Array<MediaBase & { score: number }>> {
    // 1. Fetch ALL user's media from all collections
    const userMediaItems: MediaBase[] = [];

    const userSnapshots = await Promise.all(
      MEDIA_COLLECTIONS.map((coll) =>
        db.collection(coll).where('userId', '==', userId).get(),
      ),
    );

    userSnapshots.forEach((snapshot, index) => {
      const collectionName = MEDIA_COLLECTIONS[index];
      snapshot.forEach((doc) => {
        const data = doc.data();
        userMediaItems.push({
          id: doc.id,
          type: collectionName,
          ...data,
        } as unknown as MediaBase);
      });
    });

    if (userMediaItems.length === 0) return [];

    // 2. Separate into "Seed" items (liked/completed) and "Candidate" items (to be suggested)
    const favoriteItems = userMediaItems.filter(
      (item) =>
        (item.userStats?.score && item.userStats.score >= 7) ||
        item.userStats?.status === 'Completed',
    );

    const candidateMedia = userMediaItems.filter(
      (item) =>
        item.userStats?.status !== 'Completed' &&
        (!item.userStats?.score || item.userStats.score < 7),
    );

    // If user has no favorites yet, just return some candidates as fallback
    if (favoriteItems.length === 0 || candidateMedia.length === 0) {
      return this.getFallbackRecommendations(
        limitCount,
        userId,
        userMediaItems,
      );
    }

    // 3. Extract user's favorite genres
    const genreCounts: Record<string, number> = {};
    favoriteItems.forEach((item) => {
      if (item.genres && Array.isArray(item.genres)) {
        item.genres.forEach((genre: string) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    const allUserGenres = Object.keys(genreCounts);

    // 4. Content-Based TFJS calculation
    const allGenresSet = new Set<string>();
    allUserGenres.forEach((g) => allGenresSet.add(g));
    candidateMedia.forEach((c) => {
      if (c.genres) c.genres.forEach((g: string) => allGenresSet.add(g));
    });
    const featureLabels = Array.from(allGenresSet);

    // Create user profile tensor
    const userProfileArray = featureLabels.map(
      (label) => genreCounts[label] || 0,
    );
    const userProfileTensor = tf.tensor1d(userProfileArray);
    const userNorm = tf.norm(userProfileTensor);

    const scoredCandidates: Array<MediaBase & { score: number }> =
      candidateMedia.map((candidate) => {
        const candidateArray = featureLabels.map((label) =>
          candidate.genres?.includes(label) ? 1 : 0,
        );
        const candidateTensor = tf.tensor1d(candidateArray);

        const dotProduct = tf.dot(userProfileTensor, candidateTensor);
        const candidateNorm = tf.norm(candidateTensor);

        let score = 0;
        const userNormVal = Number(userNorm.dataSync()[0]);
        const candidateNormVal = Number(candidateNorm.dataSync()[0]);

        if (userNormVal > 0 && candidateNormVal > 0) {
          const denom = (userNorm as tf.Tensor).mul(candidateNorm as tf.Tensor);
          const divResult = (dotProduct as tf.Tensor).div(denom);
          const scoreVal = divResult.dataSync()[0];
          score = scoreVal !== undefined ? Number(scoreVal) : 0;
          denom.dispose();
          divResult.dispose();
        }

        candidateTensor.dispose();
        dotProduct.dispose();
        candidateNorm.dispose();

        return {
          ...candidate,
          score,
        };
      });

    userProfileTensor.dispose();
    userNorm.dispose();

    // Sort by score descending
    scoredCandidates.sort((a, b) => b.score - a.score);

    return scoredCandidates.slice(0, limitCount);
  }

  /**
   * Get fallback recommendations when user has insufficient data
   */
  private async getFallbackRecommendations(
    limitCount: number,
    userId: string,
    preFetchedMedia?: MediaBase[],
  ): Promise<Array<MediaBase & { score: number }>> {
    const media = preFetchedMedia || [];

    // Suggest items that are "Planned" or "On Hold"
    const candidates = media.filter(
      (m) =>
        m.userStats?.status === 'Planned' || m.userStats?.status === 'On-Hold',
    );

    // If no specific candidates, just return anything not completed
    const fallback =
      candidates.length > 0
        ? candidates
        : media.filter((m) => m.userStats?.status !== 'Completed');

    return fallback.slice(0, limitCount).map((c) => ({ ...c, score: 0.1 }));
  }
}
