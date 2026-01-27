import 'package:flutter/material.dart';
import '../../domain/media_types.dart';
import '../../../../core/theme/app_colors.dart';

class MediaCard extends StatelessWidget {
  final BaseMedia media;
  final VoidCallback? onTap;
  final Color? backgroundColor;

  const MediaCard({
    super.key,
    required this.media,
    this.onTap,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: backgroundColor ?? theme.colorScheme.surfaceContainerHighest,
          // Add border if desired, but usually clean is better for full image cards
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Background Image
            media.imageUrl != null
                ? Image.network(
                    media.imageUrl!,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        _buildPlaceholder(context),
                  )
                : _buildPlaceholder(context),

            // Gradient Overlay for Title
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.fromLTRB(8, 24, 8, 8),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.transparent, AppColors.navBackground],
                  ),
                ),
                child: Text(
                  media.title,
                  textAlign: TextAlign.center,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: AppColors.textWhite,
                    shadows: [
                      const Shadow(
                        offset: Offset(0, 1),
                        blurRadius: 3.0,
                        color: AppColors.shadow,
                      ),
                    ],
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ),

            // Status Chip (Top Right)
            if (media.userStats?.status != null)
              Positioned(
                top: 8,
                right: 8,
                child: _buildStatusChip(context, media.userStats!.status!),
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
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.cardLabelBackground,
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: color.withOpacity(0.5), width: 1),
      ),
      child: Text(
        status,
        style: theme.textTheme.labelSmall?.copyWith(
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'watching':
      case 'reading':
      case 'playing':
        return AppColors.statusActive;
      case 'completed':
        return AppColors.statusCompleted;
      case 'on-hold':
      case 'on hold':
        return AppColors.statusOnHold;
      case 'dropped':
        return AppColors.statusDropped;
      case 'plan to watch':
      case 'plan to read':
      case 'plan to play':
      case 'planned':
        return AppColors.statusPlanned;
      default:
        return AppColors.statusDefault;
    }
  }
}
