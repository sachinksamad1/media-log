import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../providers/stats_providers.dart';

class StatsScreen extends ConsumerWidget {
  const StatsScreen({super.key});

  // Friendly labels for media type keys
  static const _categoryLabels = {
    'anime': 'Anime',
    'manga': 'Manga',
    'fiction': 'Fiction',
    'nonFiction': 'Non-Fiction',
    'lightNovel': 'Light Novel',
    'movie': 'Movie',
    'tvSeries': 'TV Series',
    'game': 'Game',
  };

  // Colors for each category
  static const _categoryColors = {
    'anime': Colors.purple,
    'manga': Colors.orange,
    'fiction': Colors.teal,
    'nonFiction': Colors.brown,
    'lightNovel': Colors.indigo,
    'movie': Colors.red,
    'tvSeries': Colors.blue,
    'game': Colors.green,
  };

  // Emojis for each category
  static const _categoryEmojis = {
    'anime': '📺',
    'manga': '📖',
    'fiction': '📕',
    'nonFiction': '📗',
    'lightNovel': '📚',
    'movie': '🎬',
    'tvSeries': '📺',
    'game': '🎮',
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(statsSummaryProvider);
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: CustomScrollView(
          slivers: [
            const SliverAppBar.large(title: Text('Statistics')),
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
              sliver: SliverToBoxAdapter(
                child: statsAsync.when(
                data: (stats) => Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Summary Cards
                    _buildSummaryCards(context, stats),
                    const SizedBox(height: 24),

                    // Progress Indicators
                    _buildSectionTitle(context, 'Progress'),
                    const SizedBox(height: 12),
                    _buildProgressSection(context, stats),
                    const SizedBox(height: 24),

                    // Status Breakdown
                    _buildSectionTitle(context, 'Status Breakdown'),
                    const SizedBox(height: 12),
                    _buildStatusBar(context, stats),
                    const SizedBox(height: 24),

                    // Media by Category
                    _buildSectionTitle(context, 'Media by Category'),
                    const SizedBox(height: 12),
                    _buildCategoryBars(context, stats),
                    const SizedBox(height: 24),

                    // Completion by Category
                    _buildSectionTitle(context, 'Completion by Category'),
                    const SizedBox(height: 12),
                    _buildCompletionList(context, stats),
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
                          'Failed to load statistics',
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
                          onPressed: () =>
                              ref.invalidate(statsSummaryProvider),
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

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Text(
      title,
      style: Theme.of(context)
          .textTheme
          .titleLarge
          ?.copyWith(fontWeight: FontWeight.bold),
    );
  }

  Widget _buildSummaryCards(BuildContext context, dynamic stats) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                context,
                icon: Icons.library_books_outlined,
                label: 'Total Items',
                value: stats.totalItems.toString(),
                color: Colors.deepPurple,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                context,
                icon: Icons.play_circle_outline,
                label: 'Currently Active',
                value: stats.currentlyWatching.toString(),
                color: Colors.blue,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                context,
                icon: Icons.schedule_outlined,
                label: 'In Backlog',
                value: stats.inBacklog.toString(),
                color: Colors.orange,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                context,
                icon: Icons.check_circle_outline,
                label: 'Completed',
                value: stats.completed.toString(),
                color: Colors.green,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.2), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.onSurface,
            ),
          ),
          Text(
            label,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressSection(BuildContext context, dynamic stats) {
    final theme = Theme.of(context);
    return Row(
      children: [
        Expanded(
          child: _buildCircularProgress(
            context,
            label: 'Completion Rate',
            value: stats.completionRate,
            color: Colors.green,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildCircularProgress(
            context,
            label: 'Avg Progress',
            value: stats.avgProgress,
            color: theme.colorScheme.primary,
          ),
        ),
      ],
    );
  }

  Widget _buildCircularProgress(
    BuildContext context, {
    required String label,
    required int value,
    required Color color,
  }) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          SizedBox(
            width: 80,
            height: 80,
            child: Stack(
              fit: StackFit.expand,
              children: [
                CircularProgressIndicator(
                  value: value / 100,
                  strokeWidth: 8,
                  backgroundColor: color.withValues(alpha: 0.15),
                  valueColor: AlwaysStoppedAnimation<Color>(color),
                  strokeCap: StrokeCap.round,
                ),
                Center(
                  child: Text(
                    '$value%',
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Text(
            label,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBar(BuildContext context, dynamic stats) {
    final theme = Theme.of(context);
    final total = stats.byStatus.ongoing + stats.byStatus.planned + stats.byStatus.completed;
    if (total == 0) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Center(
          child: Text(
            'No data yet',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
            ),
          ),
        ),
      );
    }

    final ongoingFraction = stats.byStatus.ongoing / total;
    final completedFraction = stats.byStatus.completed / total;
    final plannedFraction = stats.byStatus.planned / total;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          // Stacked bar
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: SizedBox(
              height: 24,
              child: Row(
                children: [
                  if (ongoingFraction > 0)
                    Expanded(
                      flex: (ongoingFraction * 100).round(),
                      child: Container(color: Colors.blue),
                    ),
                  if (completedFraction > 0)
                    Expanded(
                      flex: (completedFraction * 100).round(),
                      child: Container(color: Colors.green),
                    ),
                  if (plannedFraction > 0)
                    Expanded(
                      flex: (plannedFraction * 100).round(),
                      child: Container(color: Colors.orange),
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Legend
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildLegendItem(context, 'Ongoing', stats.byStatus.ongoing, Colors.blue),
              _buildLegendItem(context, 'Completed', stats.byStatus.completed, Colors.green),
              _buildLegendItem(context, 'Planned', stats.byStatus.planned, Colors.orange),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(BuildContext context, String label, int count, Color color) {
    final theme = Theme.of(context);
    return Flexible(
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(3),
            ),
          ),
          const SizedBox(width: 6),
          Flexible(
            child: Text(
              '$label ($count)',
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryBars(BuildContext context, dynamic stats) {
    final theme = Theme.of(context);
    final byCategory = stats.byCategory as Map<String, int>;

    if (byCategory.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Center(
          child: Text(
            'No data yet',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
            ),
          ),
        ),
      );
    }

    final maxCount = byCategory.values.fold(0, (a, b) => a > b ? a : b);

    // Sort by count descending
    final sorted = byCategory.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: sorted.map((entry) {
          final color = _categoryColors[entry.key] ?? Colors.grey;
          final label = _categoryLabels[entry.key] ?? entry.key;
          final emoji = _categoryEmojis[entry.key] ?? '📦';
          final fraction = maxCount > 0 ? entry.value / maxCount : 0.0;

          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Column(
              children: [
                Row(
                  children: [
                    Text(emoji, style: const TextStyle(fontSize: 16)),
                    const SizedBox(width: 8),
                    SizedBox(
                      width: 90,
                      child: Text(
                        label,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: fraction,
                          minHeight: 16,
                          backgroundColor: color.withValues(alpha: 0.1),
                          valueColor: AlwaysStoppedAnimation<Color>(color),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    SizedBox(
                      width: 30,
                      child: Text(
                        entry.value.toString(),
                        style: theme.textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.end,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildCompletionList(BuildContext context, dynamic stats) {
    final theme = Theme.of(context);
    final completionByCategory = stats.completionByCategory as Map<String, int>;

    if (completionByCategory.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Center(
          child: Text(
            'No data yet',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
            ),
          ),
        ),
      );
    }

    // Sort by completion rate descending
    final sorted = completionByCategory.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: sorted.map((entry) {
          final color = _categoryColors[entry.key] ?? Colors.grey;
          final label = _categoryLabels[entry.key] ?? entry.key;
          final emoji = _categoryEmojis[entry.key] ?? '📦';
          final percentage = entry.value;

          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              children: [
                Text(emoji, style: const TextStyle(fontSize: 16)),
                const SizedBox(width: 8),
                SizedBox(
                  width: 90,
                  child: Text(
                    label,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                Expanded(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: percentage / 100,
                      minHeight: 16,
                      backgroundColor: color.withValues(alpha: 0.1),
                      valueColor: AlwaysStoppedAnimation<Color>(
                        color.withValues(alpha: 0.8),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                SizedBox(
                  width: 40,
                  child: Text(
                    '$percentage%',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                    textAlign: TextAlign.end,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
