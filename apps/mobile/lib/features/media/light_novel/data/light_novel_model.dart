import 'package:json_annotation/json_annotation.dart';
import '../../domain/media_types.dart';

part 'light_novel_model.g.dart';

@JsonSerializable()
class LightNovelReleaseStats {
  final String? publishStarted;
  final String? publishEnded;
  final int? totalVolumes;
  final bool? isCompleted;

  LightNovelReleaseStats({
    this.publishStarted,
    this.publishEnded,
    this.totalVolumes,
    this.isCompleted,
  });

  factory LightNovelReleaseStats.fromJson(Map<String, dynamic> json) =>
      _$LightNovelReleaseStatsFromJson(json);
  Map<String, dynamic> toJson() => _$LightNovelReleaseStatsToJson(this);
}

@JsonSerializable()
class LightNovel implements BaseMedia {
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
  final LightNovelReleaseStats? releaseStats;
  final String? author;
  final String? illustrator;
  final String? publisher;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  LightNovel({
    required this.id,
    required this.title,
    this.imageUrl,
    this.genres,
    this.origin,
    this.language,
    this.userStats,
    this.releaseStats,
    this.author,
    this.illustrator,
    this.publisher,
    this.createdAt,
    this.updatedAt,
  });

  @override
  MediaType get mediaType => MediaType.lightNovel;

  factory LightNovel.fromJson(Map<String, dynamic> json) =>
      _$LightNovelFromJson(json);
  Map<String, dynamic> toJson() => _$LightNovelToJson(this);
}
