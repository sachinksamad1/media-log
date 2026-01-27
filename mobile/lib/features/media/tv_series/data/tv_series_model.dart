import 'package:json_annotation/json_annotation.dart';
import '../../domain/media_types.dart';

part 'tv_series_model.g.dart';

@JsonSerializable()
class TvSeriesReleaseStats {
  final String? airingStarted;
  final String? airingEnded;
  final int? totalEpisodes;
  final int? totalSeasons;
  final bool? isCompleted;
  final String? network;

  TvSeriesReleaseStats({
    this.airingStarted,
    this.airingEnded,
    this.totalEpisodes,
    this.totalSeasons,
    this.isCompleted,
    this.network,
  });

  factory TvSeriesReleaseStats.fromJson(Map<String, dynamic> json) => 
      _$TvSeriesReleaseStatsFromJson(json);
  Map<String, dynamic> toJson() => _$TvSeriesReleaseStatsToJson(this);
}

@JsonSerializable()
class TvSeries implements BaseMedia {
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
  final TvSeriesReleaseStats? releaseStats;
  final List<String>? creators;
  final List<String>? cast;
  final String? network;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  TvSeries({
    required this.id,
    required this.title,
    this.imageUrl,
    this.genres,
    this.origin,
    this.language,
    this.userStats,
    this.releaseStats,
    this.creators,
    this.cast,
    this.network,
    this.createdAt,
    this.updatedAt,
  });

  @override
  MediaType get mediaType => MediaType.tvSeries;

  factory TvSeries.fromJson(Map<String, dynamic> json) => _$TvSeriesFromJson(json);
  Map<String, dynamic> toJson() => _$TvSeriesToJson(this);
}
