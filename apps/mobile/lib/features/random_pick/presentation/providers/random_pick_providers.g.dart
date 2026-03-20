// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'random_pick_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$randomPickRepositoryHash() =>
    r'1103ae4fae5252a45489beea43af89e36641d02f';

/// See also [randomPickRepository].
@ProviderFor(randomPickRepository)
final randomPickRepositoryProvider =
    AutoDisposeProvider<RandomPickRepository>.internal(
      randomPickRepository,
      name: r'randomPickRepositoryProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$randomPickRepositoryHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef RandomPickRepositoryRef = AutoDisposeProviderRef<RandomPickRepository>;
String _$randomPickTypeFilterHash() =>
    r'5dda1f63df494f5a3b81bbac9649b240ee7ae35f';

/// See also [RandomPickTypeFilter].
@ProviderFor(RandomPickTypeFilter)
final randomPickTypeFilterProvider =
    AutoDisposeNotifierProvider<RandomPickTypeFilter, String>.internal(
      RandomPickTypeFilter.new,
      name: r'randomPickTypeFilterProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$randomPickTypeFilterHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$RandomPickTypeFilter = AutoDisposeNotifier<String>;
String _$randomPickControllerHash() =>
    r'8a5f3f2b1adfa7993d80b94221edd5cb7ec54aba';

/// See also [RandomPickController].
@ProviderFor(RandomPickController)
final randomPickControllerProvider =
    AutoDisposeAsyncNotifierProvider<
      RandomPickController,
      GlobalSearchResponse?
    >.internal(
      RandomPickController.new,
      name: r'randomPickControllerProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$randomPickControllerHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$RandomPickController =
    AutoDisposeAsyncNotifier<GlobalSearchResponse?>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
