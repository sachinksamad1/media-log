import '../../../dashboard/data/models/library_summary_model.dart';

/// Status breakdown counts
class StatusBreakdown {
  final int ongoing;
  final int planned;
  final int completed;

  const StatusBreakdown({
    this.ongoing = 0,
    this.planned = 0,
    this.completed = 0,
  });

  factory StatusBreakdown.fromJson(Map<String, dynamic> json) {
    return StatusBreakdown(
      ongoing: json['ongoing'] as int? ?? 0,
      planned: json['planned'] as int? ?? 0,
      completed: json['completed'] as int? ?? 0,
    );
  }
}

/// Full statistics summary from GET /stats/summary
class StatsSummary {
  final int totalItems;
  final int currentlyWatching;
  final int inBacklog;
  final int completed;
  final int avgProgress;
  final int completionRate;
  final Map<String, int> byCategory;
  final StatusBreakdown byStatus;
  final Map<String, int> completionByCategory;
  final Map<String, MediaCategoryStats> categoryStats;

  const StatsSummary({
    this.totalItems = 0,
    this.currentlyWatching = 0,
    this.inBacklog = 0,
    this.completed = 0,
    this.avgProgress = 0,
    this.completionRate = 0,
    this.byCategory = const {},
    this.byStatus = const StatusBreakdown(),
    this.completionByCategory = const {},
    this.categoryStats = const {},
  });

  factory StatsSummary.fromJson(Map<String, dynamic> json) {
    // Parse byCategory map
    final byCategoryRaw = json['byCategory'] as Map<String, dynamic>? ?? {};
    final byCategory = byCategoryRaw.map(
      (key, value) => MapEntry(key, (value as num?)?.toInt() ?? 0),
    );

    // Parse completionByCategory map
    final completionRaw =
        json['completionByCategory'] as Map<String, dynamic>? ?? {};
    final completionByCategory = completionRaw.map(
      (key, value) => MapEntry(key, (value as num?)?.toInt() ?? 0),
    );

    // Parse categoryStats map
    final categoryStatsRaw =
        json['categoryStats'] as Map<String, dynamic>? ?? {};
    final categoryStats = categoryStatsRaw.map(
      (key, value) => MapEntry(
        key,
        MediaCategoryStats.fromJson(value as Map<String, dynamic>),
      ),
    );

    return StatsSummary(
      totalItems: (json['totalItems'] as num?)?.toInt() ?? 0,
      currentlyWatching: (json['currentlyWatching'] as num?)?.toInt() ?? 0,
      inBacklog: (json['inBacklog'] as num?)?.toInt() ?? 0,
      completed: (json['completed'] as num?)?.toInt() ?? 0,
      avgProgress: (json['avgProgress'] as num?)?.toInt() ?? 0,
      completionRate: (json['completionRate'] as num?)?.toInt() ?? 0,
      byCategory: byCategory,
      byStatus: json['byStatus'] != null
          ? StatusBreakdown.fromJson(json['byStatus'] as Map<String, dynamic>)
          : const StatusBreakdown(),
      completionByCategory: completionByCategory,
      categoryStats: categoryStats,
    );
  }
}
