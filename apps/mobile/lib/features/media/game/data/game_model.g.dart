// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'game_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GameReleaseStats _$GameReleaseStatsFromJson(Map<String, dynamic> json) =>
    GameReleaseStats(
      releaseDate: json['releaseDate'] as String?,
      platforms: (json['platforms'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      playtime: (json['playtime'] as num?)?.toInt(),
    );

Map<String, dynamic> _$GameReleaseStatsToJson(GameReleaseStats instance) =>
    <String, dynamic>{
      'releaseDate': instance.releaseDate,
      'platforms': instance.platforms,
      'playtime': instance.playtime,
    };

Game _$GameFromJson(Map<String, dynamic> json) => Game(
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
      : GameReleaseStats.fromJson(json['releaseStats'] as Map<String, dynamic>),
  developer: json['developer'] as String?,
  publisher: json['publisher'] as String?,
  platforms: (json['platforms'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  type: json['type'] as String?,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$GameToJson(Game instance) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'imageUrl': instance.imageUrl,
  'genres': instance.genres,
  'origin': instance.origin,
  'language': instance.language,
  'userStats': instance.userStats,
  'releaseStats': instance.releaseStats,
  'developer': instance.developer,
  'publisher': instance.publisher,
  'platforms': instance.platforms,
  'type': instance.type,
  'createdAt': instance.createdAt?.toIso8601String(),
  'updatedAt': instance.updatedAt?.toIso8601String(),
};
