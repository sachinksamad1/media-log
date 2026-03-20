/// Represents the statistics for a single media category (e.g. anime, manga)
class MediaCategoryStats {
  final int total;
  final int completed;
  final int ongoing;
  final int planned;
  final int dropped;
  final int onHold;

  const MediaCategoryStats({
    this.total = 0,
    this.completed = 0,
    this.ongoing = 0,
    this.planned = 0,
    this.dropped = 0,
    this.onHold = 0,
  });

  factory MediaCategoryStats.fromJson(Map<String, dynamic> json) {
    return MediaCategoryStats(
      total: json['total'] as int? ?? 0,
      completed: json['completed'] as int? ?? 0,
      ongoing: json['ongoing'] as int? ?? 0,
      planned: json['planned'] as int? ?? 0,
      dropped: json['dropped'] as int? ?? 0,
      onHold: json['onHold'] as int? ?? 0,
    );
  }
}

/// Represents the full library stats grouped by media type
class LibrarySummary {
  final MediaCategoryStats anime;
  final MediaCategoryStats manga;
  final MediaCategoryStats movie;
  final MediaCategoryStats tvSeries;
  final MediaCategoryStats fiction;
  final MediaCategoryStats nonFiction;
  final MediaCategoryStats lightNovel;
  final MediaCategoryStats game;

  const LibrarySummary({
    this.anime = const MediaCategoryStats(),
    this.manga = const MediaCategoryStats(),
    this.movie = const MediaCategoryStats(),
    this.tvSeries = const MediaCategoryStats(),
    this.fiction = const MediaCategoryStats(),
    this.nonFiction = const MediaCategoryStats(),
    this.lightNovel = const MediaCategoryStats(),
    this.game = const MediaCategoryStats(),
  });

  factory LibrarySummary.fromJson(Map<String, dynamic> json) {
    return LibrarySummary(
      anime: json['anime'] != null
          ? MediaCategoryStats.fromJson(json['anime'])
          : const MediaCategoryStats(),
      manga: json['manga'] != null
          ? MediaCategoryStats.fromJson(json['manga'])
          : const MediaCategoryStats(),
      movie: json['movie'] != null
          ? MediaCategoryStats.fromJson(json['movie'])
          : const MediaCategoryStats(),
      tvSeries: json['tvSeries'] != null
          ? MediaCategoryStats.fromJson(json['tvSeries'])
          : const MediaCategoryStats(),
      fiction: json['fiction'] != null
          ? MediaCategoryStats.fromJson(json['fiction'])
          : const MediaCategoryStats(),
      nonFiction: json['nonFiction'] != null
          ? MediaCategoryStats.fromJson(json['nonFiction'])
          : const MediaCategoryStats(),
      lightNovel: json['lightNovel'] != null
          ? MediaCategoryStats.fromJson(json['lightNovel'])
          : const MediaCategoryStats(),
      game: json['game'] != null
          ? MediaCategoryStats.fromJson(json['game'])
          : const MediaCategoryStats(),
    );
  }
}
