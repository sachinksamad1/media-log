import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/network/api_client.dart';
import 'models/stats_summary_model.dart';

part 'stats_repository.g.dart';

class StatsRepository {
  final Dio _dio;

  StatsRepository(this._dio);

  Future<StatsSummary> getStatsSummary() async {
    try {
      final response = await _dio.get('stats/summary');

      if (response.data['success'] == true && response.data['data'] != null) {
        return StatsSummary.fromJson(response.data['data']);
      } else {
        throw Exception(
          response.data['message'] ?? 'Failed to load statistics',
        );
      }
    } catch (e) {
      throw Exception('Failed to load statistics: $e');
    }
  }
}

@riverpod
StatsRepository statsRepository(Ref ref) {
  return StatsRepository(ref.watch(dioClientProvider));
}
