export class Mapper {
  /**
   * Transforms a Firestore document into a clean JSON object for the API.
   * Handles Firestore Timestamps and ensures IDs are included.
   */
  static toDTO<T>(data: any): T {
    const dto = { ...data };

    // Convert Firestore Timestamps to ISO Strings for Flutter/Angular
    for (const key in dto) {
      if (dto[key] && typeof dto[key].toDate === 'function') {
        dto[key] = dto[key].toDate().toISOString();
      }
    }

    return dto as T;
  }

  /**
   * Specifically maps the Anime entity to the AnimeResponseDTO
   */
  static toAnimeDTO(data: any) {
    const base = this.toDTO<any>(data);
    
    return {
      ...base,
      // Create a UI-friendly progress string for the frontend cards
      displayProgress: `${base.animeStats.currentSeason} / ${base.animeStats.totalSeasons}`,
      // Boolean logic for simpler frontend checks
      isHighRated: base.userStats.score >= 9.0
    };
  }
}