import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/random_pick_model.dart';
import '../providers/random_pick_providers.dart';


class RandomPickScreen extends ConsumerWidget {
  const RandomPickScreen({super.key});

  static const _mediaTypeOptions = {
    'all': 'Any Media',
    'anime': 'Anime',
    'manga': 'Manga',
    'fiction': 'Fiction',
    'nonFiction': 'Non-Fiction',
    'lightNovel': 'Light Novel',
    'movie': 'Movie',
    'tvSeries': 'TV Series',
    'game': 'Game',
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
    'anime': '📺',
    'manga': '📖',
    'fiction': '📕',
    'nonFiction': '📗',
    'lightNovel': '📚',
    'movie': '🎬',
    'tvSeries': '📺',
    'game': '🎮',
  };

  // Status Colors (from GlobalSearchResponse spec)
  Color _getStatusColor(String status) {
    switch (status) {
      case 'Ongoing':
      case 'Watching':
      case 'Reading':
      case 'Playing':
        return Colors.blue;
      case 'Completed':
        return Colors.green;
      case 'On Hold':
        return Colors.orange;
      case 'Dropped':
        return Colors.red;
      case 'Planned':
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final randomPickAsync = ref.watch(randomPickControllerProvider);
    final selectedFilter = ref.watch(randomPickTypeFilterProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Random Pick'),
        actions: [
          // Filter button
          PopupMenuButton<String>(
            icon: const Icon(Icons.filter_list),
            tooltip: 'Filter by Media Type',
            initialValue: selectedFilter,
            onSelected: (value) {
              ref.read(randomPickTypeFilterProvider.notifier).setFilter(value);
              ref.read(randomPickControllerProvider.notifier).rollAgain();
            },
            itemBuilder: (context) {
              return _mediaTypeOptions.entries.map((entry) {
                return PopupMenuItem(
                  value: entry.key,
                  child: Row(
                    children: [
                      if (entry.key != 'all')
                        Text(_mediaTypeEmojis[entry.key] ?? '📦', style: const TextStyle(fontSize: 18)),
                      if (entry.key != 'all') const SizedBox(width: 8),
                      Text(entry.value),
                      if (selectedFilter == entry.key) ...[
                        const Spacer(),
                        const Icon(Icons.check, size: 18),
                      ]
                    ],
                  ),
                );
              }).toList();
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Current Filter Indicator
              if (selectedFilter != 'all')
                Padding(
                  padding: const EdgeInsets.only(bottom: 16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.category, size: 16, color: Colors.grey),
                      const SizedBox(width: 8),
                      Text(
                        'Filtering by: ${_mediaTypeOptions[selectedFilter]}',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: Colors.grey[600],
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ],
                  ),
                ),

              // Main Content Area
              Expanded(
                child: randomPickAsync.when(
                  data: (item) {
                    if (item == null) {
                      return _buildEmptyState(context);
                    }
                    return _buildResultCard(context, item);
                  },
                  loading: () => const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(),
                        SizedBox(height: 16),
                        Text('Rolling the dice...'),
                      ],
                    ),
                  ),
                  error: (error, stack) => Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.error_outline,
                            size: 64, color: theme.colorScheme.error),
                        const SizedBox(height: 16),
                        Text(
                          'Oops, something went wrong!',
                          style: theme.textTheme.titleLarge,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          error.toString(),
                          textAlign: TextAlign.center,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Roll Again Button
              Padding(
                padding: const EdgeInsets.only(top: 16.0, bottom: 8.0),
                child: FilledButton.icon(
                  onPressed: randomPickAsync.isLoading
                      ? null
                      : () => ref.read(randomPickControllerProvider.notifier).rollAgain(),
                  icon: const Icon(Icons.casino),
                  label: const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16.0),
                    child: Text('Roll Again', style: TextStyle(fontSize: 18)),
                  ),
                  style: FilledButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.inbox_outlined,
            size: 80,
            color: theme.colorScheme.primary.withValues(alpha: 0.5),
          ),
          const SizedBox(height: 24),
          Text(
            'Nothing to pick from!',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'We couldn\'t find any items in your backlog\nfor the selected filter.',
            textAlign: TextAlign.center,
            style: theme.textTheme.bodyLarge?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime? date) {
    if (date == null) return 'Unknown';
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  Widget _buildResultCard(BuildContext context, GlobalSearchResponse item) {
    final theme = Theme.of(context);
    final mediaTypeColor =
        _mediaTypeColors[item.mediaType] ?? theme.colorScheme.primary;
    final statusColor = _getStatusColor(item.parsedUserStats.status);

    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      clipBehavior: Clip.antiAlias, // Fixed ClipAntiAlias -> Clip.antiAlias
      child: InkWell(
        onTap: () {
          // Navigate to details if needed
          // context.push('/${item.mediaType}/${item.id}');
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Image Header
            Expanded(
              flex: 3,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  if (item.imageUrl.isNotEmpty)
                    Image.network(
                      item.imageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          _buildPlaceholderImage(context, mediaTypeColor),
                    )
                  else
                    _buildPlaceholderImage(context, mediaTypeColor),
                  
                  // Gradient Overlay for text readability
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withValues(alpha: 0.8),
                        ],
                        stops: const [0.6, 1.0],
                      ),
                    ),
                  ),

                  // Media Type Badge
                  Positioned(
                    top: 16,
                    left: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: mediaTypeColor,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.2),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            _mediaTypeEmojis[item.mediaType] ?? '📦',
                            style: const TextStyle(fontSize: 14),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            _mediaTypeOptions[item.mediaType] ?? item.mediaType.toUpperCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Details Section
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      style: theme.textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 16),
                    
                    // Status & Score Row
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: statusColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: statusColor.withValues(alpha: 0.5)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.flag, size: 14, color: statusColor),
                              const SizedBox(width: 4),
                              Text(
                                item.parsedUserStats.status,
                                style: theme.textTheme.labelMedium?.copyWith(
                                  color: statusColor,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        if (item.parsedUserStats.score > 0)
                          Row(
                            children: [
                              const Icon(Icons.star, size: 18, color: Colors.amber),
                              const SizedBox(width: 4),
                              Text(
                                '${item.parsedUserStats.score}/10',
                                style: theme.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                      ],
                    ),
                    
                    const Spacer(),
                    
                    // Added Date Footer
                    Row(
                      children: [
                        Icon(
                          Icons.calendar_today,
                          size: 14,
                          color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Added ${_formatDate(item.createdAt)}',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholderImage(BuildContext context, Color color) {
    return Container(
      color: color.withValues(alpha: 0.1),
      child: Center(
        child: Icon(
          Icons.image_outlined,
          size: 64,
          color: color.withValues(alpha: 0.3),
        ),
      ),
    );
  }
}
