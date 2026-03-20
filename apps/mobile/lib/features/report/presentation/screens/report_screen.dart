import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/models/report_models.dart';
import '../../data/report_repository.dart';
import '../providers/report_providers.dart';

class ReportScreen extends ConsumerWidget {
  const ReportScreen({super.key});

  static const _mediaTypeOptions = {
    'all': 'All Media',
    'anime': 'Anime',
    'manga': 'Manga',
    'fiction': 'Fiction',
    'nonFiction': 'Non-Fiction',
    'lightNovel': 'Light Novel',
    'movie': 'Movie',
    'tvSeries': 'TV Series',
    'game': 'Game',
  };

  static const _statusOptions = [
    'All',
    'Ongoing',
    'Completed',
    'Planned',
    'On Hold',
    'Dropped',
  ];

  static const _timeRangeOptions = {
    'all': 'All Time',
    'last7days': 'Last 7 Days',
    'last30days': 'Last 30 Days',
    'last90days': 'Last 90 Days',
    'thisYear': 'This Year',
  };

  static const _mediaTypeColors = {
    'anime': Colors.purple,
    'manga': Colors.orange,
    'fiction': Colors.teal,
    'nonFiction': Colors.brown,
    'lightNovel': Colors.indigo,
    'movie': Colors.red,
    'tvSeries': Colors.blue,
    'game': Colors.green,
  };

  static const _mediaTypeEmojis = {
    'Anime': '📺',
    'Manga': '📖',
    'Fiction': '📕',
    'Non-Fiction': '📗',
    'Light Novel': '📚',
    'Movie': '🎬',
    'TV Series': '📺',
    'Game': '🎮',
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final reportAsync = ref.watch(reportProvider);
    final filters = ref.watch(reportFiltersProvider);

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: CustomScrollView(
          slivers: [
            SliverAppBar.large(
              title: const Text('Reports'),
            actions: [
              IconButton(
                icon: const Icon(Icons.file_download_outlined),
                tooltip: 'Export',
                onPressed: () => _showExportDialog(context, ref),
              ),
              const SizedBox(width: 8),
            ],
          ),
          // Filter chips
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  _buildFilterChip(
                    context,
                    label: _mediaTypeOptions[filters.mediaType] ?? 'All Media',
                    icon: Icons.category_outlined,
                    onTap: () => _showMediaTypeFilter(context, ref),
                    isActive: filters.mediaType != 'all',
                  ),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    context,
                    label: filters.status ?? 'All Status',
                    icon: Icons.flag_outlined,
                    onTap: () => _showStatusFilter(context, ref),
                    isActive: filters.status != null,
                  ),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    context,
                    label: _timeRangeOptions[filters.timeRange] ?? 'All Time',
                    icon: Icons.calendar_today_outlined,
                    onTap: () => _showTimeRangeFilter(context, ref),
                    isActive: filters.timeRange != null &&
                        filters.timeRange != 'all',
                  ),
                  if (_hasActiveFilters(filters)) ...[
                    const SizedBox(width: 8),
                    ActionChip(
                      avatar: const Icon(Icons.clear, size: 16),
                      label: const Text('Clear'),
                      onPressed: () {
                        ref.read(reportFiltersProvider.notifier).state =
                            const ReportFilters();
                        ref.read(reportPageProvider.notifier).state = 1;
                      },
                    ),
                  ],
                ],
              ),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),
          // Content
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 48),
            sliver: SliverToBoxAdapter(
              child: reportAsync.when(
                data: (report) => Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Summary cards
                    _buildSummaryRow(context, report.summary),
                    const SizedBox(height: 24),

                    // Results header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${report.pagination.totalItems} items',
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Page ${report.pagination.page} of ${report.pagination.totalPages}',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurface
                                .withValues(alpha: 0.6),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Report items
                    if (report.items.isEmpty)
                      _buildEmptyState(context)
                    else
                      ...report.items.map(
                        (item) => _buildReportItemCard(context, item),
                      ),

                    // Pagination controls
                    if (report.pagination.totalPages > 1) ...[
                      const SizedBox(height: 16),
                      _buildPaginationControls(context, ref, report.pagination),
                    ],
                    const SizedBox(height: 32),
                  ],
                ),
                loading: () => const Center(
                  child: Padding(
                    padding: EdgeInsets.all(64),
                    child: CircularProgressIndicator(),
                  ),
                ),
                error: (error, stack) => Center(
                  child: Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 48,
                          color: theme.colorScheme.error,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Failed to load report',
                          style: theme.textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          error.toString(),
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurface
                                .withValues(alpha: 0.6),
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        FilledButton.icon(
                          onPressed: () => ref.invalidate(reportProvider),
                          icon: const Icon(Icons.refresh),
                          label: const Text('Retry'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

  bool _hasActiveFilters(ReportFilters filters) {
    return filters.mediaType != 'all' ||
        filters.status != null ||
        (filters.timeRange != null && filters.timeRange != 'all');
  }

  Widget _buildFilterChip(
    BuildContext context, {
    required String label,
    required IconData icon,
    required VoidCallback onTap,
    bool isActive = false,
  }) {
    final theme = Theme.of(context);
    return FilterChip(
      avatar: Icon(icon, size: 18),
      label: Text(label),
      selected: isActive,
      onSelected: (_) => onTap(),
      selectedColor: theme.colorScheme.primaryContainer,
    );
  }

  Widget _buildSummaryRow(BuildContext context, ReportSummary summary) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildMiniCard(
                context,
                icon: Icons.library_books,
                label: 'Total',
                value: summary.totalItems.toString(),
                color: Colors.deepPurple,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildMiniCard(
                context,
                icon: Icons.star,
                label: 'Avg Score',
                value: summary.averageScore.toString(),
                color: Colors.amber,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: _buildMiniCard(
                context,
                icon: Icons.add_circle_outline,
                label: 'Recently Added',
                value: summary.recentlyAdded.toString(),
                color: Colors.green,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildMiniCard(
                context,
                icon: Icons.update,
                label: 'Recently Updated',
                value: summary.recentlyUpdated.toString(),
                color: Colors.blue,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMiniCard(
    BuildContext context, {
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  label,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color:
                        theme.colorScheme.onSurface.withValues(alpha: 0.6),
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReportItemCard(BuildContext context, ReportItem item) {
    final theme = Theme.of(context);
    final mediaColor = _mediaTypeColors[item.mediaType] ?? Colors.grey;
    final emoji = _mediaTypeEmojis[item.mediaType] ?? '📦';

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color:
            theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          // Image or placeholder
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: SizedBox(
              width: 50,
              height: 70,
              child: item.imageUrl != null && item.imageUrl!.isNotEmpty
                  ? Image.network(
                      item.imageUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        color: mediaColor.withValues(alpha: 0.2),
                        child: Center(
                          child: Text(emoji, style: const TextStyle(fontSize: 20)),
                        ),
                      ),
                    )
                  : Container(
                      color: mediaColor.withValues(alpha: 0.2),
                      child: Center(
                        child: Text(emoji, style: const TextStyle(fontSize: 20)),
                      ),
                    ),
            ),
          ),
          const SizedBox(width: 12),
          // Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.title,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: mediaColor.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        item.mediaType,
                        style: theme.textTheme.labelSmall?.copyWith(
                          color: mediaColor,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    _buildStatusBadge(context, item.status),
                  ],
                ),
                const SizedBox(height: 4),
                if (item.genres.isNotEmpty)
                  Text(
                    item.genres.take(3).join(', '),
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
              ],
            ),
          ),
          // Score
          if (item.score > 0)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.amber.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.star, color: Colors.amber, size: 14),
                  const SizedBox(width: 2),
                  Text(
                    item.score.toStringAsFixed(0),
                    style: theme.textTheme.bodySmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.amber.shade700,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(BuildContext context, String status) {
    Color color;
    switch (status) {
      case 'Ongoing':
        color = Colors.blue;
        break;
      case 'Completed':
        color = Colors.green;
        break;
      case 'Planned':
        color = Colors.purple;
        break;
      case 'On Hold':
        color = Colors.orange;
        break;
      case 'Dropped':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        status,
        style: TextStyle(
          fontSize: 11,
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            Icon(
              Icons.inbox_outlined,
              size: 48,
              color: theme.colorScheme.onSurface.withValues(alpha: 0.3),
            ),
            const SizedBox(height: 16),
            Text(
              'No items found',
              style: theme.textTheme.titleMedium?.copyWith(
                color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Try adjusting your filters',
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurface.withValues(alpha: 0.4),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaginationControls(
    BuildContext context,
    WidgetRef ref,
    ReportPagination pagination,
  ) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        IconButton.outlined(
          onPressed: pagination.page > 1
              ? () {
                  ref.read(reportPageProvider.notifier).state =
                      pagination.page - 1;
                }
              : null,
          icon: const Icon(Icons.chevron_left),
        ),
        const SizedBox(width: 16),
        Text('Page ${pagination.page} of ${pagination.totalPages}'),
        const SizedBox(width: 16),
        IconButton.outlined(
          onPressed: pagination.hasMore
              ? () {
                  ref.read(reportPageProvider.notifier).state =
                      pagination.page + 1;
                }
              : null,
          icon: const Icon(Icons.chevron_right),
        ),
      ],
    );
  }

  void _showMediaTypeFilter(BuildContext context, WidgetRef ref) {
    final currentFilters = ref.read(reportFiltersProvider);
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: ListView(
          shrinkWrap: true,
          children: _mediaTypeOptions.entries.map((entry) {
            return ListTile(
              title: Text(entry.value),
              trailing: currentFilters.mediaType == entry.key
                  ? const Icon(Icons.check)
                  : null,
              onTap: () {
                ref.read(reportFiltersProvider.notifier).state =
                    currentFilters.copyWith(mediaType: entry.key);
                ref.read(reportPageProvider.notifier).state = 1;
                Navigator.pop(context);
              },
            );
          }).toList(),
        ),
      ),
    );
  }

  void _showStatusFilter(BuildContext context, WidgetRef ref) {
    final currentFilters = ref.read(reportFiltersProvider);
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: ListView(
          shrinkWrap: true,
          children: _statusOptions.map((status) {
            final isAll = status == 'All';
            return ListTile(
              title: Text(status),
              trailing: (isAll && currentFilters.status == null) ||
                      currentFilters.status == status
                  ? const Icon(Icons.check)
                  : null,
              onTap: () {
                ref.read(reportFiltersProvider.notifier).state =
                    ReportFilters(
                  mediaType: currentFilters.mediaType,
                  status: isAll ? null : status,
                  timeRange: currentFilters.timeRange,
                );
                ref.read(reportPageProvider.notifier).state = 1;
                Navigator.pop(context);
              },
            );
          }).toList(),
        ),
      ),
    );
  }

  void _showTimeRangeFilter(BuildContext context, WidgetRef ref) {
    final currentFilters = ref.read(reportFiltersProvider);
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: ListView(
          shrinkWrap: true,
          children: _timeRangeOptions.entries.map((entry) {
            return ListTile(
              title: Text(entry.value),
              trailing: (currentFilters.timeRange ?? 'all') == entry.key
                  ? const Icon(Icons.check)
                  : null,
              onTap: () {
                ref.read(reportFiltersProvider.notifier).state =
                    currentFilters.copyWith(
                  timeRange: entry.key,
                );
                ref.read(reportPageProvider.notifier).state = 1;
                Navigator.pop(context);
              },
            );
          }).toList(),
        ),
      ),
    );
  }

  void _showExportDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Export Report'),
        content: const Text(
          'Choose the format to export your media report.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton.tonal(
            onPressed: () {
              Navigator.pop(context);
              _doExport(context, ref, 'csv');
            },
            child: const Text('CSV'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(context);
              _doExport(context, ref, 'json');
            },
            child: const Text('JSON'),
          ),
        ],
      ),
    );
  }

  Future<void> _doExport(
    BuildContext context,
    WidgetRef ref,
    String format,
  ) async {
    final scaffoldMessenger = ScaffoldMessenger.of(context);
    try {
      final filters = ref.read(reportFiltersProvider);
      final repository = ref.read(reportRepositoryProvider);
      await repository.exportReport(filters: filters, format: format);
      scaffoldMessenger.showSnackBar(
        SnackBar(
          content: Text('Report exported as ${format.toUpperCase()}'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } catch (e) {
      scaffoldMessenger.showSnackBar(
        SnackBar(
          content: Text('Export failed: $e'),
          behavior: SnackBarBehavior.floating,
          backgroundColor: scaffoldMessenger.context.mounted
              ? Theme.of(context).colorScheme.error
              : null,
        ),
      );
    }
  }
}
