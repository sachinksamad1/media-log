class UserActivity {
  final String? id;
  final String userId;
  final String action;
  final String resourceType;
  final String resourceId;
  final String? resourceTitle;
  final String? details;
  final DateTime createdAt;

  const UserActivity({
    this.id,
    required this.userId,
    required this.action,
    required this.resourceType,
    required this.resourceId,
    this.resourceTitle,
    this.details,
    required this.createdAt,
  });

  factory UserActivity.fromJson(Map<String, dynamic> json) {
    return UserActivity(
      id: json['id'] as String?,
      userId: json['userId'] as String? ?? '',
      action: json['action'] as String? ?? 'UPDATE',
      resourceType: json['resourceType'] as String? ?? '',
      resourceId: json['resourceId'] as String? ?? '',
      resourceTitle: json['resourceTitle'] as String?,
      details: json['details'] as String?,
      createdAt: json['createdAt'] != null
          ? (json['createdAt'] is int
                ? DateTime.fromMillisecondsSinceEpoch(json['createdAt'] as int)
                : DateTime.tryParse(json['createdAt'].toString()) ??
                      DateTime.now())
          : DateTime.now(),
    );
  }
}
