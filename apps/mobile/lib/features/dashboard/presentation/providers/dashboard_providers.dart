import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../data/models/library_summary_model.dart';
import '../../data/models/user_activity_model.dart';
import '../../data/dashboard_repository.dart';

part 'dashboard_providers.g.dart';

@riverpod
Future<LibrarySummary> librarySummary(Ref ref) async {
  final repository = ref.watch(dashboardRepositoryProvider);
  return repository.getLibrarySummary();
}

@riverpod
Future<List<UserActivity>> userActivity(Ref ref) async {
  final repository = ref.watch(dashboardRepositoryProvider);
  return repository.getRecentActivities();
}
