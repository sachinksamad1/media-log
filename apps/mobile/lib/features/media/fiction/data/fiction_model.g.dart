// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fiction_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FictionReleaseStats _$FictionReleaseStatsFromJson(Map<String, dynamic> json) =>
    FictionReleaseStats(
      publishDate: json['publishDate'] as String?,
      pages: (json['pages'] as num?)?.toInt(),
      volumes: (json['volumes'] as num?)?.toInt(),
    );

Map<String, dynamic> _$FictionReleaseStatsToJson(
  FictionReleaseStats instance,
) => <String, dynamic>{
  'publishDate': instance.publishDate,
  'pages': instance.pages,
  'volumes': instance.volumes,
};

Fiction _$FictionFromJson(Map<String, dynamic> json) => Fiction(
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
      : FictionReleaseStats.fromJson(
          json['releaseStats'] as Map<String, dynamic>,
        ),
  author: json['author'] as String?,
  publisher: json['publisher'] as String?,
  type: json['type'] as String?,
  format: json['format'] as String?,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$FictionToJson(Fiction instance) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'imageUrl': instance.imageUrl,
  'genres': instance.genres,
  'origin': instance.origin,
  'language': instance.language,
  'userStats': instance.userStats,
  'releaseStats': instance.releaseStats,
  'author': instance.author,
  'publisher': instance.publisher,
  'type': instance.type,
  'format': instance.format,
  'createdAt': instance.createdAt?.toIso8601String(),
  'updatedAt': instance.updatedAt?.toIso8601String(),
};
