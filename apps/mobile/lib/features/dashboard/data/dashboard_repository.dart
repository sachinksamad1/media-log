import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/api_client.dart';
import 'models/library_summary_model.dart';
import 'models/user_activity_model.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'dashboard_repository.g.dart';

class DashboardRepository {
  final Dio _dio;

  DashboardRepository(this._dio);

  Future<LibrarySummary> getLibrarySummary() async {
    try {
      final response = await _dio.get('dashboard/library-summary');

      // API response structure: { "success": true, "data": { "anime": {...}, "manga": {...} } }
      if (response.data['success'] == true && response.data['data'] != null) {
        return LibrarySummary.fromJson(response.data['data']);
      } else {
        throw Exception(
          response.data['message'] ?? 'Failed to load library summary',
        );
      }
    } catch (e) {
      throw Exception('Failed to load dashboard data: $e');
    }
  }

  Future<List<UserActivity>> getRecentActivities({int limit = 5}) async {
    try {
      final response = await _dio.get(
        'user-activity',
        queryParameters: {'limit': limit},
      );

      if (response.data['success'] == true && response.data['data'] != null) {
        final List<dynamic> data = response.data['data'];
        return data.map((json) => UserActivity.fromJson(json)).toList();
      } else {
        throw Exception(
          response.data['message'] ?? 'Failed to load user activity',
        );
      }
    } catch (e) {
      throw Exception('Failed to load recent activities: $e');
    }
  }
}

@riverpod
DashboardRepository dashboardRepository(Ref ref) {
  return DashboardRepository(ref.watch(dioClientProvider));
}
