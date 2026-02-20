import 'package:json_annotation/json_annotation.dart';
import '../../domain/media_types.dart';

part 'movie_model.g.dart';

@JsonSerializable()
class MovieReleaseStats {
  final String? releaseDate;
  final int? runtime; // in minutes
  final String? rating; // PG, PG-13, R, etc.

  MovieReleaseStats({this.releaseDate, this.runtime, this.rating});

  factory MovieReleaseStats.fromJson(Map<String, dynamic> json) =>
      _$MovieReleaseStatsFromJson(json);
  Map<String, dynamic> toJson() => _$MovieReleaseStatsToJson(this);
}

@JsonSerializable()
class Movie implements BaseMedia {
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
  final MovieReleaseStats? releaseStats;
  final String? director;
  final List<String>? cast;
  final String? studio;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  Movie({
    required this.id,
    required this.title,
    this.imageUrl,
    this.genres,
    this.origin,
    this.language,
    this.userStats,
    this.releaseStats,
    this.director,
    this.cast,
    this.studio,
    this.createdAt,
    this.updatedAt,
  });

  @override
  MediaType get mediaType => MediaType.movie;

  factory Movie.fromJson(Map<String, dynamic> json) => _$MovieFromJson(json);
  Map<String, dynamic> toJson() => _$MovieToJson(this);
}
