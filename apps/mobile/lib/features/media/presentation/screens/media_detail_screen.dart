import 'package:flutter/material.dart';
import '../../domain/media_types.dart';
import '../../anime/data/anime_model.dart';
import '../../manga/data/manga_model.dart';

import '../../game/data/game_model.dart';

class MediaDetailScreen extends StatelessWidget {
  final BaseMedia media;

  const MediaDetailScreen({super.key, required this.media});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App Bar with Image
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                media.title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  shadows: [Shadow(color: Colors.black, blurRadius: 4)],
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  if (media.imageUrl != null)
                    Image.network(
                      media.imageUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => Container(
                        color: theme.colorScheme.surfaceContainerHighest,
                      ),
                    )
                  else
                    Container(color: theme.colorScheme.surfaceContainerHighest),

                  // Gradient overlay
                  DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withValues(alpha: 0.7),
                        ],
                        stops: const [0.6, 1.0],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Basic Info Row (Score, Status, Type)
                  _buildHeaderRow(context),
                  const SizedBox(height: 24),

                  // Genres
                  if (media.genres != null && media.genres!.isNotEmpty) ...[
                    Text(
                      'Genres',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: media.genres!
                          .map(
                            (g) => Chip(
                              label: Text(g),
                              padding: EdgeInsets.zero,
                              labelStyle: theme.textTheme.labelSmall,
                              backgroundColor: theme
                                  .colorScheme
                                  .secondaryContainer
                                  .withValues(alpha: 0.5),
                              side: BorderSide.none,
                            ),
                          )
                          .toList(),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Specific Details (Studio, Author, Developer etc)
                  _buildSpecificDetails(context),

                  const SizedBox(height: 24),

                  // Release Stats
                  _buildReleaseStats(context),

                  // User Stats
                  if (media.userStats != null &&
                      (media.userStats!.notes?.isNotEmpty ?? false)) ...[
                    const SizedBox(height: 24),
                    Text(
                      'My Notes',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.surfaceContainerHighest
                            .withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(media.userStats!.notes!),
                    ),
                  ],

                  // Extra padding for bottom
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderRow(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        if (media.userStats?.score != null)
          Column(
            children: [
              Icon(Icons.star_rounded, color: Colors.amber, size: 28),
              Text(
                media.userStats!.score.toString(),
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        Column(
          children: [
            Icon(
              Icons.info_outline,
              color: theme.colorScheme.primary,
              size: 28,
            ),
            Text(
              media.mediaType.displayName,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        if (media.userStats?.status != null)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: theme.colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              media.userStats!.status!,
              style: theme.textTheme.labelMedium?.copyWith(
                color: theme.colorScheme.onPrimaryContainer,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildSpecificDetails(BuildContext context) {
    // Determine type and cast
    if (media is Anime) {
      final item = media as Anime;
      return _buildDetailSection(context, [
        if (item.studio != null) _DetailItem('Studio', item.studio!),
        if (item.type != null) _DetailItem('Type', item.type!),
        if (item.origin != null) _DetailItem('Origin', item.origin!),
        if (item.language != null) _DetailItem('Language', item.language!),
      ]);
    } else if (media is Manga) {
      final item = media as Manga;
      return _buildDetailSection(context, [
        if (item.author != null) _DetailItem('Author', item.author!),
        if (item.artist != null) _DetailItem('Artist', item.artist!),
        if (item.origin != null) _DetailItem('Origin', item.origin!),
      ]);
    } else if (media is Game) {
      final item = media as Game;
      return _buildDetailSection(context, [
        if (item.developer != null) _DetailItem('Developer', item.developer!),
        if (item.publisher != null) _DetailItem('Publisher', item.publisher!),
        if (item.platforms != null && item.platforms!.isNotEmpty)
          _DetailItem('Platforms', item.platforms!.join(', ')),
      ]);
    }
    // Fallback for generic
    return _buildDetailSection(context, [
      if (media.origin != null) _DetailItem('Origin', media.origin!),
      if (media.language != null) _DetailItem('Language', media.language!),
    ]);
  }

  Widget _buildReleaseStats(BuildContext context) {
    final theme = Theme.of(context);

    if (media is Anime) {
      final item = media as Anime;
      final stats = item.releaseStats;
      if (stats == null) return const SizedBox.shrink();

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Release Info',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          _buildInfoGrid([
            if (stats.totalEpisodes != null)
              _InfoTile('Episodes', stats.totalEpisodes.toString()),
            if (stats.totalSeasons != null)
              _InfoTile('Seasons', stats.totalSeasons.toString()),
            if (stats.airingStarted != null)
              _InfoTile('Started', stats.airingStarted!),
            if (stats.airingEnded != null)
              _InfoTile('Ended', stats.airingEnded!),
          ]),
        ],
      );
    }

    if (media is Game) {
      final item = media as Game;
      final stats = item.releaseStats;
      if (stats == null) return const SizedBox.shrink();

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Release Info',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          _buildInfoGrid([
            if (stats.releaseDate != null)
              _InfoTile('Released', stats.releaseDate!),
            if (stats.playtime != null)
              _InfoTile('Playtime', '${stats.playtime} hrs'),
          ]),
        ],
      );
    }

    if (media is Manga) {
      final item = media as Manga;
      final stats = item.releaseStats;
      if (stats == null) return const SizedBox.shrink();

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Release Info',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          _buildInfoGrid([
            if (stats.totalChapters != null)
              _InfoTile('Chapters', stats.totalChapters.toString()),
            if (stats.totalVolumes != null)
              _InfoTile('Volumes', stats.totalVolumes.toString()),
            if (stats.publishStarted != null)
              _InfoTile('Published', stats.publishStarted!),
            if (stats.publishEnded != null)
              _InfoTile('Ended', stats.publishEnded!),
          ]),
        ],
      );
    }

    return const SizedBox.shrink();
  }

  Widget _buildDetailSection(BuildContext context, List<_DetailItem> items) {
    if (items.isEmpty) return const SizedBox.shrink();
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Details',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: theme.colorScheme.surfaceContainerHighest.withValues(
              alpha: 0.3,
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: items
                .map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                          width: 100,
                          child: Text(
                            item.label,
                            style: TextStyle(
                              color: theme.colorScheme.onSurface.withValues(
                                alpha: 0.6,
                              ),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        Expanded(
                          child: Text(
                            item.value,
                            style: const TextStyle(fontWeight: FontWeight.w600),
                          ),
                        ),
                      ],
                    ),
                  ),
                )
                .toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoGrid(List<_InfoTile> tiles) {
    if (tiles.isEmpty) return const SizedBox.shrink();
    return GridView.count(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      crossAxisCount: 2,
      childAspectRatio: 2.5,
      mainAxisSpacing: 8,
      crossAxisSpacing: 8,
      children: tiles
          .map(
            (t) => Card(
              elevation: 0,
              color: Colors.transparent,
              shape: RoundedRectangleBorder(
                side: BorderSide(color: Colors.grey.withValues(alpha: 0.2)),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      t.label,
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                    Text(
                      t.value,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ),
          )
          .toList(),
    );
  }
}

class _DetailItem {
  final String label;
  final String value;
  _DetailItem(this.label, this.value);
}

class _InfoTile {
  final String label;
  final String value;
  _InfoTile(this.label, this.value);
}
