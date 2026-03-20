// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'report_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$reportHash() => r'a9727c6ee51daea447a6e462e80b766ab4a3ba57';

/// Fetches report data based on current filters and page
///
/// Copied from [report].
@ProviderFor(report)
final reportProvider = AutoDisposeFutureProvider<ReportResponse>.internal(
  report,
  name: r'reportProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$reportHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ReportRef = AutoDisposeFutureProviderRef<ReportResponse>;
String _$reportSummaryHash() => r'7a6190400c223a8383afd24cd71f299e49b78366';

/// Fetches report summary
///
/// Copied from [reportSummary].
@ProviderFor(reportSummary)
final reportSummaryProvider = AutoDisposeFutureProvider<ReportSummary>.internal(
  reportSummary,
  name: r'reportSummaryProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$reportSummaryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ReportSummaryRef = AutoDisposeFutureProviderRef<ReportSummary>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
