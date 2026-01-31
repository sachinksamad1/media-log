import 'package:json_annotation/json_annotation.dart';
import '../../domain/media_types.dart';

part 'fiction_model.g.dart';

@JsonSerializable()
class FictionReleaseStats {
  final String? publishDate;
  final int? pages;
  final int? volumes;

  FictionReleaseStats({this.publishDate, this.pages, this.volumes});

  factory FictionReleaseStats.fromJson(Map<String, dynamic> json) =>
      _$FictionReleaseStatsFromJson(json);
  Map<String, dynamic> toJson() => _$FictionReleaseStatsToJson(this);
}

@JsonSerializable()
class Fiction implements BaseMedia {
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
  final FictionReleaseStats? releaseStats;
  final String? author;
  final String? publisher;
  final String? type; // Novel, Short Story, Series, etc.
  final String? format; // Hardcover, Paperback, E-Book, etc.
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  Fiction({
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
    this.type,
    this.format,
    this.createdAt,
    this.updatedAt,
  });

  @override
  MediaType get mediaType => MediaType.fiction;

  factory Fiction.fromJson(Map<String, dynamic> json) =>
      _$FictionFromJson(json);
  Map<String, dynamic> toJson() => _$FictionToJson(this);
}
