import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../data/models/report_models.dart';
import '../../data/report_repository.dart';

part 'report_providers.g.dart';

/// Current report filters state
final reportFiltersProvider = StateProvider<ReportFilters>((ref) {
  return const ReportFilters();
});

/// Current page for pagination
final reportPageProvider = StateProvider<int>((ref) => 1);

/// Fetches report data based on current filters and page
@riverpod
Future<ReportResponse> report(Ref ref) async {
  final repository = ref.watch(reportRepositoryProvider);
  final filters = ref.watch(reportFiltersProvider);
  final page = ref.watch(reportPageProvider);
  return repository.getReport(filters: filters, page: page);
}

/// Fetches report summary
@riverpod
Future<ReportSummary> reportSummary(Ref ref) async {
  final repository = ref.watch(reportRepositoryProvider);
  return repository.getReportSummary();
}
