// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'movie_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MovieReleaseStats _$MovieReleaseStatsFromJson(Map<String, dynamic> json) =>
    MovieReleaseStats(
      releaseDate: json['releaseDate'] as String?,
      runtime: (json['runtime'] as num?)?.toInt(),
      rating: json['rating'] as String?,
    );

Map<String, dynamic> _$MovieReleaseStatsToJson(MovieReleaseStats instance) =>
    <String, dynamic>{
      'releaseDate': instance.releaseDate,
      'runtime': instance.runtime,
      'rating': instance.rating,
    };

Movie _$MovieFromJson(Map<String, dynamic> json) => Movie(
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
      : MovieReleaseStats.fromJson(
          json['releaseStats'] as Map<String, dynamic>,
        ),
  director: json['director'] as String?,
  cast: (json['cast'] as List<dynamic>?)?.map((e) => e as String).toList(),
  studio: json['studio'] as String?,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$MovieToJson(Movie instance) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'imageUrl': instance.imageUrl,
  'genres': instance.genres,
  'origin': instance.origin,
  'language': instance.language,
  'userStats': instance.userStats,
  'releaseStats': instance.releaseStats,
  'director': instance.director,
  'cast': instance.cast,
  'studio': instance.studio,
  'createdAt': instance.createdAt?.toIso8601String(),
  'updatedAt': instance.updatedAt?.toIso8601String(),
};
