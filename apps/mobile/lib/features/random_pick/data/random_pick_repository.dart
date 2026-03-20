import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import 'models/random_pick_model.dart';

class RandomPickRepository {
  final Dio _dio;

  RandomPickRepository(this._dio);

  Future<GlobalSearchResponse?> getRandomPick({String? mediaType}) async {
    try {
      final queryParams = <String, dynamic>{};
      if (mediaType != null && mediaType != 'all') {
        queryParams['type'] = mediaType;
      }

      final response = await _dio.get(
        'search/random',
        queryParameters: queryParams,
      );

      if (response.data == null || response.data['data'] == null) {
        return null; // Return null intentionally if no item was found
      }

      return GlobalSearchResponse.fromJson(response.data['data']);
    } on DioException catch (e) {
      if (kDebugMode) {
        print('Error fetching random pick: $e');
      }
      throw Exception(e.message ?? 'Unknown error occurred');
    } catch (e) {
      if (kDebugMode) {
        print('Error fetching random pick: $e');
      }
      rethrow;
    }
  }
}

