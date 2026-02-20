// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'anime_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AnimeReleaseStats _$AnimeReleaseStatsFromJson(Map<String, dynamic> json) =>
    AnimeReleaseStats(
      airingStarted: json['airingStarted'] as String?,
      airingEnded: json['airingEnded'] as String?,
      totalEpisodes: (json['totalEpisodes'] as num?)?.toInt(),
      totalSeasons: (json['totalSeasons'] as num?)?.toInt(),
      isCompleted: json['isCompleted'] as bool?,
    );

Map<String, dynamic> _$AnimeReleaseStatsToJson(AnimeReleaseStats instance) =>
    <String, dynamic>{
      'airingStarted': instance.airingStarted,
      'airingEnded': instance.airingEnded,
      'totalEpisodes': instance.totalEpisodes,
      'totalSeasons': instance.totalSeasons,
      'isCompleted': instance.isCompleted,
    };

Anime _$AnimeFromJson(Map<String, dynamic> json) => Anime(
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
      : AnimeReleaseStats.fromJson(
          json['releaseStats'] as Map<String, dynamic>,
        ),
  studio: json['studio'] as String?,
  type: json['type'] as String?,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$AnimeToJson(Anime instance) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'imageUrl': instance.imageUrl,
  'genres': instance.genres,
  'origin': instance.origin,
  'language': instance.language,
  'userStats': instance.userStats,
  'releaseStats': instance.releaseStats,
  'studio': instance.studio,
  'type': instance.type,
  'createdAt': instance.createdAt?.toIso8601String(),
  'updatedAt': instance.updatedAt?.toIso8601String(),
};
