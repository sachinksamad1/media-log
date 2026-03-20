// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'non_fiction_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

NonFictionReleaseStats _$NonFictionReleaseStatsFromJson(
  Map<String, dynamic> json,
) => NonFictionReleaseStats(
  publishDate: json['publishDate'] as String?,
  pages: (json['pages'] as num?)?.toInt(),
  editions: (json['editions'] as num?)?.toInt(),
);

Map<String, dynamic> _$NonFictionReleaseStatsToJson(
  NonFictionReleaseStats instance,
) => <String, dynamic>{
  'publishDate': instance.publishDate,
  'pages': instance.pages,
  'editions': instance.editions,
};

NonFiction _$NonFictionFromJson(Map<String, dynamic> json) => NonFiction(
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
      : NonFictionReleaseStats.fromJson(
          json['releaseStats'] as Map<String, dynamic>,
        ),
  author: json['author'] as String?,
  publisher: json['publisher'] as String?,
  category: json['category'] as String?,
  format: json['format'] as String?,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$NonFictionToJson(NonFiction instance) =>
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
      'publisher': instance.publisher,
      'category': instance.category,
      'format': instance.format,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };
