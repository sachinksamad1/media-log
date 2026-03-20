/// Represents a single item in the report
class ReportItem {
  final String id;
  final String mediaType;
  final String title;
  final List<String> genres;
  final double score;
  final String status;
  final String? imageUrl;
  final String createdAt;
  final String updatedAt;

  const ReportItem({
    required this.id,
    required this.mediaType,
    required this.title,
    this.genres = const [],
    this.score = 0,
    this.status = 'Unknown',
    this.imageUrl,
    this.createdAt = '',
    this.updatedAt = '',
  });

  factory ReportItem.fromJson(Map<String, dynamic> json) {
    return ReportItem(
      id: json['id'] as String? ?? '',
      mediaType: json['mediaType'] as String? ?? '',
      title: json['title'] as String? ?? '',
      genres: (json['genres'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      score: (json['score'] as num?)?.toDouble() ?? 0,
      status: json['status'] as String? ?? 'Unknown',
      imageUrl: json['imageUrl'] as String?,
      createdAt: json['createdAt'] as String? ?? '',
      updatedAt: json['updatedAt'] as String? ?? '',
    );
  }
}

/// Summary statistics for the report
class ReportSummary {
  final int totalItems;
  final Map<String, int> byStatus;
  final Map<String, int> byMediaType;
  final int averageScore;
  final int recentlyAdded;
  final int recentlyUpdated;

  const ReportSummary({
    this.totalItems = 0,
    this.byStatus = const {},
    this.byMediaType = const {},
    this.averageScore = 0,
    this.recentlyAdded = 0,
    this.recentlyUpdated = 0,
  });

  factory ReportSummary.fromJson(Map<String, dynamic> json) {
    final byStatusRaw = json['byStatus'] as Map<String, dynamic>? ?? {};
    final byStatus = byStatusRaw.map(
      (key, value) => MapEntry(key, (value as num?)?.toInt() ?? 0),
    );

    final byMediaTypeRaw = json['byMediaType'] as Map<String, dynamic>? ?? {};
    final byMediaType = byMediaTypeRaw.map(
      (key, value) => MapEntry(key, (value as num?)?.toInt() ?? 0),
    );

    return ReportSummary(
      totalItems: (json['totalItems'] as num?)?.toInt() ?? 0,
      byStatus: byStatus,
      byMediaType: byMediaType,
      averageScore: (json['averageScore'] as num?)?.toInt() ?? 0,
      recentlyAdded: (json['recentlyAdded'] as num?)?.toInt() ?? 0,
      recentlyUpdated: (json['recentlyUpdated'] as num?)?.toInt() ?? 0,
    );
  }
}

/// Pagination info from the report response
class ReportPagination {
  final int page;
  final int limit;
  final int totalItems;
  final int totalPages;
  final bool hasMore;

  const ReportPagination({
    this.page = 1,
    this.limit = 20,
    this.totalItems = 0,
    this.totalPages = 0,
    this.hasMore = false,
  });

  factory ReportPagination.fromJson(Map<String, dynamic> json) {
    return ReportPagination(
      page: (json['page'] as num?)?.toInt() ?? 1,
      limit: (json['limit'] as num?)?.toInt() ?? 20,
      totalItems: (json['totalItems'] as num?)?.toInt() ?? 0,
      totalPages: (json['totalPages'] as num?)?.toInt() ?? 0,
      hasMore: json['hasMore'] as bool? ?? false,
    );
  }
}

/// Full response from GET /reports
class ReportResponse {
  final List<ReportItem> items;
  final ReportSummary summary;
  final ReportPagination pagination;

  const ReportResponse({
    this.items = const [],
    this.summary = const ReportSummary(),
    this.pagination = const ReportPagination(),
  });

  factory ReportResponse.fromJson(Map<String, dynamic> json) {
    return ReportResponse(
      items: (json['items'] as List<dynamic>?)
              ?.map(
                (e) => ReportItem.fromJson(e as Map<String, dynamic>),
              )
              .toList() ??
          [],
      summary: json['summary'] != null
          ? ReportSummary.fromJson(json['summary'] as Map<String, dynamic>)
          : const ReportSummary(),
      pagination: json['pagination'] != null
          ? ReportPagination.fromJson(
              json['pagination'] as Map<String, dynamic>,
            )
          : const ReportPagination(),
    );
  }
}

/// Filters for the report query
class ReportFilters {
  final String mediaType;
  final String? status;
  final String? timeRange;
  final String? startDate;
  final String? endDate;
  final double? minScore;
  final double? maxScore;

  const ReportFilters({
    this.mediaType = 'all',
    this.status,
    this.timeRange,
    this.startDate,
    this.endDate,
    this.minScore,
    this.maxScore,
  });

  ReportFilters copyWith({
    String? mediaType,
    String? status,
    String? timeRange,
    String? startDate,
    String? endDate,
    double? minScore,
    double? maxScore,
  }) {
    return ReportFilters(
      mediaType: mediaType ?? this.mediaType,
      status: status ?? this.status,
      timeRange: timeRange ?? this.timeRange,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      minScore: minScore ?? this.minScore,
      maxScore: maxScore ?? this.maxScore,
    );
  }

  Map<String, dynamic> toQueryParameters() {
    final params = <String, dynamic>{
      'mediaType': mediaType,
    };
    if (status != null) params['status'] = status;
    if (timeRange != null) params['timeRange'] = timeRange;
    if (startDate != null) params['startDate'] = startDate;
    if (endDate != null) params['endDate'] = endDate;
    if (minScore != null) params['minScore'] = minScore;
    if (maxScore != null) params['maxScore'] = maxScore;
    return params;
  }
}
