import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../data/models/stats_summary_model.dart';
import '../../data/stats_repository.dart';

part 'stats_providers.g.dart';

@riverpod
Future<StatsSummary> statsSummary(Ref ref) async {
  final repository = ref.watch(statsRepositoryProvider);
  return repository.getStatsSummary();
}
