import 'package:json_annotation/json_annotation.dart';
import '../../domain/media_types.dart';

part 'manga_model.g.dart';

@JsonSerializable()
class MangaReleaseStats {
  final String? publishStarted;
  final String? publishEnded;
  final int? totalChapters;
  final int? totalVolumes;
  final bool? isCompleted;

  MangaReleaseStats({
    this.publishStarted,
    this.publishEnded,
    this.totalChapters,
    this.totalVolumes,
    this.isCompleted,
  });

  factory MangaReleaseStats.fromJson(Map<String, dynamic> json) =>
      _$MangaReleaseStatsFromJson(json);
  Map<String, dynamic> toJson() => _$MangaReleaseStatsToJson(this);
}

@JsonSerializable()
class Manga implements BaseMedia {
  @override
  final String id;
  @override
  final String title;
  @override
  @JsonKey(name: 'imageUrl')
  final String? imageUrl;
  @override
  final List<String>? genres;
  @override
  final String? origin;
  @override
  final String? language;
  @override
  final UserStats? userStats;
  final MangaReleaseStats? releaseStats;
  final String? author;
  final String? artist;
  final String? type; // Manga, Manhwa, Manhua, etc.
  final String? status;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  Manga({
    required this.id,
    required this.title,
    this.imageUrl,
    this.genres,
    this.origin,
    this.language,
    this.userStats,
    this.releaseStats,
    this.author,
    this.artist,
    this.type,
    this.status,
    this.createdAt,
    this.updatedAt,
  });

  @override
  MediaType get mediaType => MediaType.manga;

  factory Manga.fromJson(Map<String, dynamic> json) => _$MangaFromJson(json);
  Map<String, dynamic> toJson() => _$MangaToJson(this);
}
