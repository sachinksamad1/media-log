import 'package:json_annotation/json_annotation.dart';
import '../../domain/media_types.dart';

part 'anime_model.g.dart';

@JsonSerializable()
class AnimeReleaseStats {
  final String? airingStarted;
  final String? airingEnded;
  final int? totalEpisodes;
  final int? totalSeasons;
  final bool? isCompleted;

  AnimeReleaseStats({
    this.airingStarted,
    this.airingEnded,
    this.totalEpisodes,
    this.totalSeasons,
    this.isCompleted,
  });

  factory AnimeReleaseStats.fromJson(Map<String, dynamic> json) =>
      _$AnimeReleaseStatsFromJson(json);
  Map<String, dynamic> toJson() => _$AnimeReleaseStatsToJson(this);
}

@JsonSerializable()
class Anime implements BaseMedia {
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
  final AnimeReleaseStats? releaseStats;
  final String? studio;
  final String? type; // TV, Movie, OVA, etc.
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  Anime({
    required this.id,
    required this.title,
    this.imageUrl,
    this.genres,
    this.origin,
    this.language,
    this.userStats,
    this.releaseStats,
    this.studio,
    this.type,
    this.createdAt,
    this.updatedAt,
  });

  @override
  MediaType get mediaType => MediaType.anime;

  factory Anime.fromJson(Map<String, dynamic> json) => _$AnimeFromJson(json);
  Map<String, dynamic> toJson() => _$AnimeToJson(this);
}
