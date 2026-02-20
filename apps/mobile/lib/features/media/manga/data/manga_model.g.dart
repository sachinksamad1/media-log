// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'manga_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MangaReleaseStats _$MangaReleaseStatsFromJson(Map<String, dynamic> json) =>
    MangaReleaseStats(
      publishStarted: json['publishStarted'] as String?,
      publishEnded: json['publishEnded'] as String?,
      totalChapters: (json['totalChapters'] as num?)?.toInt(),
      totalVolumes: (json['totalVolumes'] as num?)?.toInt(),
      isCompleted: json['isCompleted'] as bool?,
    );

Map<String, dynamic> _$MangaReleaseStatsToJson(MangaReleaseStats instance) =>
    <String, dynamic>{
      'publishStarted': instance.publishStarted,
      'publishEnded': instance.publishEnded,
      'totalChapters': instance.totalChapters,
      'totalVolumes': instance.totalVolumes,
      'isCompleted': instance.isCompleted,
    };

Manga _$MangaFromJson(Map<String, dynamic> json) => Manga(
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
      : MangaReleaseStats.fromJson(
          json['releaseStats'] as Map<String, dynamic>,
        ),
  author: json['author'] as String?,
  artist: json['artist'] as String?,
  type: json['type'] as String?,
  status: json['status'] as String?,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$MangaToJson(Manga instance) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'imageUrl': instance.imageUrl,
  'genres': instance.genres,
  'origin': instance.origin,
  'language': instance.language,
  'userStats': instance.userStats,
  'releaseStats': instance.releaseStats,
  'author': instance.author,
  'artist': instance.artist,
  'type': instance.type,
  'status': instance.status,
  'createdAt': instance.createdAt?.toIso8601String(),
  'updatedAt': instance.updatedAt?.toIso8601String(),
};
