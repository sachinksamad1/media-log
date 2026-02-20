import 'package:json_annotation/json_annotation.dart';
import '../../domain/media_types.dart';

part 'non_fiction_model.g.dart';

@JsonSerializable()
class NonFictionReleaseStats {
  final String? publishDate;
  final int? pages;
  final int? editions;

  NonFictionReleaseStats({this.publishDate, this.pages, this.editions});

  factory NonFictionReleaseStats.fromJson(Map<String, dynamic> json) =>
      _$NonFictionReleaseStatsFromJson(json);
  Map<String, dynamic> toJson() => _$NonFictionReleaseStatsToJson(this);
}

@JsonSerializable()
class NonFiction implements BaseMedia {
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
  final NonFictionReleaseStats? releaseStats;
  final String? author;
  final String? publisher;
  final String? category; // Biography, History, Science, etc.
  final String? format;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  NonFiction({
    required this.id,
    required this.title,
    this.imageUrl,
    this.genres,
    this.origin,
    this.language,
    this.userStats,
    this.releaseStats,
    this.author,
    this.publisher,
    this.category,
    this.format,
    this.createdAt,
    this.updatedAt,
  });

  @override
  MediaType get mediaType => MediaType.nonFiction;

  factory NonFiction.fromJson(Map<String, dynamic> json) =>
      _$NonFictionFromJson(json);
  Map<String, dynamic> toJson() => _$NonFictionToJson(this);
}
