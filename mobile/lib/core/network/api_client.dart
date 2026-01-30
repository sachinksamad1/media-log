import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

part 'api_client.g.dart';

@riverpod
Dio dioClient(Ref ref) {
  final baseUrl = dotenv.env['API_BASE_URL'];
  
  final dio = Dio(
    BaseOptions(
      baseUrl: baseUrl!,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ),
  );
  
  // Add auth interceptor to include Firebase token
  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final user = FirebaseAuth.instance.currentUser;
        if (user != null) {
          final token = await user.getIdToken();
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        // Handle 401 errors (token expired, etc.)
        if (error.response?.statusCode == 401) {
          // Optionally: trigger logout or token refresh
        }
        return handler.next(error);
      },
    ),
  );
  
  dio.interceptors.add(LogInterceptor(
    requestBody: true,
    responseBody: true,
  ));

  return dio;
}
