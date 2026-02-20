// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tv_series_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TvSeriesReleaseStats _$TvSeriesReleaseStatsFromJson(
  Map<String, dynamic> json,
) => TvSeriesReleaseStats(
  airingStarted: json['airingStarted'] as String?,
  airingEnded: json['airingEnded'] as String?,
  totalEpisodes: (json['totalEpisodes'] as num?)?.toInt(),
  totalSeasons: (json['totalSeasons'] as num?)?.toInt(),
  isCompleted: json['isCompleted'] as bool?,
  network: json['network'] as String?,
);

Map<String, dynamic> _$TvSeriesReleaseStatsToJson(
  TvSeriesReleaseStats instance,
) => <String, dynamic>{
  'airingStarted': instance.airingStarted,
  'airingEnded': instance.airingEnded,
  'totalEpisodes': instance.totalEpisodes,
  'totalSeasons': instance.totalSeasons,
  'isCompleted': instance.isCompleted,
  'network': instance.network,
};

TvSeries _$TvSeriesFromJson(Map<String, dynamic> json) => TvSeries(
  id: json['id'] as String,
  title: json['title'] as String,
  imageUrl: json['imageUrl'] as String?,
  genres: (json['genres'] as List<dynamic>?)?.map((e) => e as String).toList(),
  origin: json['origin'] as String?,
  language: json['language'] as String?,
  userStats: json['userStats'] == null
      ? null
      : UserStats.fromJson(json['userStats'] as Map<String, dynamic>),
  releaseStats: json['releaseStats'] == null
      ? null
      : TvSeriesReleaseStats.fromJson(
          json['releaseStats'] as Map<String, dynamic>,
        ),
  creators: (json['creators'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  cast: (json['cast'] as List<dynamic>?)?.map((e) => e as String).toList(),
  network: json['network'] as String?,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$TvSeriesToJson(TvSeries instance) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'imageUrl': instance.imageUrl,
  'genres': instance.genres,
  'origin': instance.origin,
  'language': instance.language,
  'userStats': instance.userStats,
  'releaseStats': instance.releaseStats,
  'creators': instance.creators,
  'cast': instance.cast,
  'network': instance.network,
  'createdAt': instance.createdAt?.toIso8601String(),
  'updatedAt': instance.updatedAt?.toIso8601String(),
};
