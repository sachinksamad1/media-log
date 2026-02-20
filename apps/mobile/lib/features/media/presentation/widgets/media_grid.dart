import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/media_types.dart';
import 'media_card.dart';

class MediaGrid<T extends BaseMedia> extends StatelessWidget {
  final AsyncValue<List<T>> mediaListAsync;
  final String emptyMessage;
  final String emptySubMessage;
  final IconData emptyIcon;
  final VoidCallback? onRefresh;
  final void Function(T media)? onItemTap;

  const MediaGrid({
    super.key,
    required this.mediaListAsync,
    this.emptyMessage = 'No items found',
    this.emptySubMessage = 'Add some to your library',
    this.emptyIcon = Icons.inbox_outlined,
    this.onRefresh,
    this.onItemTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return mediaListAsync.when(
      data: (mediaList) {
        if (mediaList.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(emptyIcon, size: 64, color: theme.disabledColor),
                const SizedBox(height: 16),
                Text(emptyMessage, style: theme.textTheme.titleLarge),
                const SizedBox(height: 8),
                Text(
                  emptySubMessage,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                  ),
                ),
              ],
            ),
          );
        }
        return GridView.builder(
          padding: const EdgeInsets.all(16),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.65,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemCount: mediaList.length,
          itemBuilder: (context, index) {
            final media = mediaList[index];
            return MediaCard(
              media: media,
              onTap: onItemTap != null ? () => onItemTap!(media) : null,
            );
          },
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stack) => Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 48,
                color: theme.colorScheme.error,
              ),
              const SizedBox(height: 16),
              Text(
                'Error loading data',
                style: theme.textTheme.titleMedium?.copyWith(
                  color: theme.colorScheme.error,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                error.toString(),
                textAlign: TextAlign.center,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                ),
              ),
              if (onRefresh != null) ...[
                const SizedBox(height: 16),
                FilledButton.icon(
                  onPressed: onRefresh,
                  icon: const Icon(Icons.refresh),
                  label: const Text('Retry'),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
