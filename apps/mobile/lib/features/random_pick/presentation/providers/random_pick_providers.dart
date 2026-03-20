import 'dart:async';

import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../core/network/api_client.dart';
import '../../data/models/random_pick_model.dart';
import '../../data/random_pick_repository.dart';

part 'random_pick_providers.g.dart';

@riverpod
RandomPickRepository randomPickRepository(RandomPickRepositoryRef ref) {
  final dio = ref.watch(dioClientProvider);
  return RandomPickRepository(dio);
}

@riverpod
class RandomPickTypeFilter extends _$RandomPickTypeFilter {
  @override
  String build() => 'all';

  void setFilter(String filter) {
    state = filter;
  }
}

@riverpod
class RandomPickController extends _$RandomPickController {
  @override
  FutureOr<GlobalSearchResponse?> build() async {
    return _fetchRandomPick();
  }

  Future<GlobalSearchResponse?> _fetchRandomPick() async {
    final typeFilter = ref.watch(randomPickTypeFilterProvider);
    final repository = ref.read(randomPickRepositoryProvider);
    
    return repository.getRandomPick(mediaType: typeFilter);
  }

  Future<void> rollAgain() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(_fetchRandomPick);
  }
}

