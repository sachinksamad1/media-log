// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'light_novel_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LightNovelReleaseStats _$LightNovelReleaseStatsFromJson(
  Map<String, dynamic> json,
) => LightNovelReleaseStats(
  publishStarted: json['publishStarted'] as String?,
  publishEnded: json['publishEnded'] as String?,
  totalVolumes: (json['totalVolumes'] as num?)?.toInt(),
  isCompleted: json['isCompleted'] as bool?,
);

Map<String, dynamic> _$LightNovelReleaseStatsToJson(
  LightNovelReleaseStats instance,
) => <String, dynamic>{
  'publishStarted': instance.publishStarted,
  'publishEnded': instance.publishEnded,
  'totalVolumes': instance.totalVolumes,
  'isCompleted': instance.isCompleted,
};

LightNovel _$LightNovelFromJson(Map<String, dynamic> json) => LightNovel(
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
      : LightNovelReleaseStats.fromJson(
          json['releaseStats'] as Map<String, dynamic>,
        ),
  author: json['author'] as String?,
  illustrator: json['illustrator'] as String?,
  publisher: json['publisher'] as String?,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$LightNovelToJson(LightNovel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'imageUrl': instance.imageUrl,
      'genres': instance.genres,
      'origin': instance.origin,
      'language': instance.language,
      'userStats': instance.userStats,
      'releaseStats': instance.releaseStats,
      'author': instance.author,
      'illustrator': instance.illustrator,
      'publisher': instance.publisher,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };
