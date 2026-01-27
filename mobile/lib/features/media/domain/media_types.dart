/// Enum representing different media types
enum MediaType {
  anime('anime', 'Anime', '📺'),
  manga('manga', 'Manga', '📖'),
  lightNovel('light-novel', 'Light Novel', '📚'),
  fiction('fiction', 'Fiction', '📕'),
  nonFiction('non-fiction', 'Non-Fiction', '📗'),
  movie('movie', 'Movie', '🎬'),
  tvSeries('tv-series', 'TV Series', '📺'),
  game('games', 'Game', '🎮');

  final String apiPath;
  final String displayName;
  final String emoji;

  const MediaType(this.apiPath, this.displayName, this.emoji);
}

/// Common user stats across all media types
class UserStats {
  final double? score;
  final String? status;
  final String? notes;

  UserStats({this.score, this.status, this.notes});

  factory UserStats.fromJson(Map<String, dynamic> json) => UserStats(
    score: (json['score'] as num?)?.toDouble(),
    status: json['status'] as String?,
    notes: json['notes'] as String?,
  );

  Map<String, dynamic> toJson() => {
    'score': score,
    'status': status,
    'notes': notes,
  };
}

/// Base class for all media items
abstract class BaseMedia {
  String get id;
  String get title;
  String? get imageUrl;
  List<String>? get genres;
  String? get origin;
  String? get language;
  UserStats? get userStats;
  DateTime? get createdAt;
  DateTime? get updatedAt;
  
  MediaType get mediaType;
}
