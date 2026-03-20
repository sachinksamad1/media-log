import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/network/api_client.dart';
import 'models/report_models.dart';

part 'report_repository.g.dart';

class ReportRepository {
  final Dio _dio;

  ReportRepository(this._dio);

  /// GET /reports — paginated report with filters
  Future<ReportResponse> getReport({
    ReportFilters filters = const ReportFilters(),
    int page = 1,
    int limit = 20,
    String sortBy = 'createdAt',
    String sortOrder = 'desc',
  }) async {
    try {
      final queryParams = <String, dynamic>{
        ...filters.toQueryParameters(),
        'page': page,
        'limit': limit,
        'sortBy': sortBy,
        'sortOrder': sortOrder,
      };

      final response = await _dio.get(
        'reports',
        queryParameters: queryParams,
      );

      if (response.data['success'] == true && response.data['data'] != null) {
        return ReportResponse.fromJson(
          response.data['data'] as Map<String, dynamic>,
        );
      } else {
        throw Exception(
          response.data['message'] ?? 'Failed to load report',
        );
      }
    } catch (e) {
      throw Exception('Failed to load report: $e');
    }
  }

  /// GET /reports/summary — quick summary
  Future<ReportSummary> getReportSummary() async {
    try {
      final response = await _dio.get('reports/summary');

      if (response.data['success'] == true && response.data['data'] != null) {
        return ReportSummary.fromJson(
          response.data['data'] as Map<String, dynamic>,
        );
      } else {
        throw Exception(
          response.data['message'] ?? 'Failed to load report summary',
        );
      }
    } catch (e) {
      throw Exception('Failed to load report summary: $e');
    }
  }

  /// GET /reports/export — export report data
  Future<String> exportReport({
    ReportFilters filters = const ReportFilters(),
    String format = 'csv',
  }) async {
    try {
      final queryParams = <String, dynamic>{
        ...filters.toQueryParameters(),
        'format': format,
      };

      final response = await _dio.get(
        'reports/export',
        queryParameters: queryParams,
      );

      if (response.data['success'] == true && response.data['data'] != null) {
        return response.data['data'].toString();
      } else {
        throw Exception(
          response.data['message'] ?? 'Failed to export report',
        );
      }
    } catch (e) {
      throw Exception('Failed to export report: $e');
    }
  }
}

@riverpod
ReportRepository reportRepository(Ref ref) {
  return ReportRepository(ref.watch(dioClientProvider));
}
