import 'package:json_annotation/json_annotation.dart';
import '../../domain/media_types.dart';

part 'game_model.g.dart';

@JsonSerializable()
class GameReleaseStats {
  final String? releaseDate;
  final List<String>? platforms;
  final int? playtime; // average playtime in hours

  GameReleaseStats({this.releaseDate, this.platforms, this.playtime});

  factory GameReleaseStats.fromJson(Map<String, dynamic> json) =>
      _$GameReleaseStatsFromJson(json);
  Map<String, dynamic> toJson() => _$GameReleaseStatsToJson(this);
}

@JsonSerializable()
class Game implements BaseMedia {
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
  final GameReleaseStats? releaseStats;
  final String? developer;
  final String? publisher;
  final List<String>? platforms;
  final String? type; // Single-player, Multiplayer, MMO, etc.
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  Game({
    required this.id,
    required this.title,
    this.imageUrl,
    this.genres,
    this.origin,
    this.language,
    this.userStats,
    this.releaseStats,
    this.developer,
    this.publisher,
    this.platforms,
    this.type,
    this.createdAt,
    this.updatedAt,
  });

  @override
  MediaType get mediaType => MediaType.game;

  factory Game.fromJson(Map<String, dynamic> json) => _$GameFromJson(json);
  Map<String, dynamic> toJson() => _$GameToJson(this);
}
