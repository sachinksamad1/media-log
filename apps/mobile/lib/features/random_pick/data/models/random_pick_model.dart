class GlobalSearchResponse {
  final String id;
  final String title;
  final String imageUrl;
  final String mediaType;
  final UserStatsResponse userStats;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const GlobalSearchResponse({
    required this.id,
    required this.title,
    this.imageUrl = '',
    this.mediaType = '',
    this.userStats = const UserStatsResponse(),
    this.createdAt,
    this.updatedAt,
  });

  factory GlobalSearchResponse.fromJson(Map<String, dynamic> json) {
    return GlobalSearchResponse(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      imageUrl: json['imageUrl'] as String? ?? '',
      mediaType: json['mediaType'] as String? ?? '',
      userStats: json['userStats'] != null
          ? UserStatsResponse.fromJson(
              json['userStats'] as Map<String, dynamic>)
          : const UserStatsResponse(),
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String)
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.tryParse(json['updatedAt'] as String)
          : null,
    );
  }

  UserStats get parsedUserStats => UserStats(
        score: userStats.score,
        status: userStats.status,
      );
}

class UserStatsResponse {
  final int score;
  final String status;

  const UserStatsResponse({
    this.score = 0,
    this.status = 'Planned',
  });

  factory UserStatsResponse.fromJson(Map<String, dynamic> json) {
    return UserStatsResponse(
      score: (json['score'] as num?)?.toInt() ?? 0,
      status: json['status'] as String? ?? 'Planned',
    );
  }
}

class UserStats {
  final int score;
  final String status;
  
  const UserStats({this.score = 0, this.status = 'Planned'});
}
