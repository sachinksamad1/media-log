import 'package:flutter/material.dart';
import '../../domain/media_types.dart';

class MediaCard extends StatelessWidget {
  final BaseMedia media;
  final VoidCallback? onTap;

  const MediaCard({
    super.key,
    required this.media,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.5),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Expanded(
              flex: 4,
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerHighest,
                ),
                child: media.imageUrl != null
                    ? Image.network(
                        media.imageUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => 
                            _buildPlaceholder(context),
                      )
                    : _buildPlaceholder(context),
              ),
            ),
            // Info
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      media.title,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    if (media.userStats?.status != null)
                      _buildStatusChip(context, media.userStats!.status!),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholder(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Icon(
        _getMediaIcon(),
        size: 40,
        color: theme.colorScheme.primary.withOpacity(0.5),
      ),
    );
  }

  IconData _getMediaIcon() {
    switch (media.mediaType) {
      case MediaType.anime:
        return Icons.movie_outlined;
      case MediaType.manga:
        return Icons.menu_book_outlined;
      case MediaType.lightNovel:
        return Icons.auto_stories_outlined;
      case MediaType.fiction:
        return Icons.book_outlined;
      case MediaType.nonFiction:
        return Icons.library_books_outlined;
      case MediaType.movie:
        return Icons.theaters_outlined;
      case MediaType.tvSeries:
        return Icons.tv_outlined;
      case MediaType.game:
        return Icons.games_outlined;
    }
  }

  Widget _buildStatusChip(BuildContext context, String status) {
    final theme = Theme.of(context);
    final color = _getStatusColor(status);
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        status,
        style: theme.textTheme.labelSmall?.copyWith(
          color: color,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'watching':
      case 'reading':
      case 'playing':
        return Colors.blue;
      case 'completed':
        return Colors.green;
      case 'on-hold':
      case 'on hold':
        return Colors.orange;
      case 'dropped':
        return Colors.red;
      case 'plan to watch':
      case 'plan to read':
      case 'plan to play':
      case 'planned':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }
}
