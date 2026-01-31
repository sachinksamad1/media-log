import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../domain/media_types.dart';
import '../../data/media_repository.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Watch all media lists
    final animeList = ref.watch(animeListProvider);
    final mangaList = ref.watch(mangaListProvider);
    final lightNovelList = ref.watch(lightNovelListProvider);
    final fictionList = ref.watch(fictionListProvider);
    final nonFictionList = ref.watch(nonFictionListProvider);
    final movieList = ref.watch(movieListProvider);
    final tvSeriesList = ref.watch(tvSeriesListProvider);
    final gameList = ref.watch(gameListProvider);

    final theme = Theme.of(context);

    // Combine all loaded data
    final List<BaseMedia> allMedia = [
      ...?animeList.valueOrNull,
      ...?mangaList.valueOrNull,
      ...?lightNovelList.valueOrNull,
      ...?fictionList.valueOrNull,
      ...?nonFictionList.valueOrNull,
      ...?movieList.valueOrNull,
      ...?tvSeriesList.valueOrNull,
      ...?gameList.valueOrNull,
    ];

    // Filter based on query
    final filteredMedia = _query.isEmpty
        ? <BaseMedia>[]
        : allMedia
              .where(
                (media) =>
                    media.title.toLowerCase().contains(_query.toLowerCase()),
              )
              .toList();

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'Search library...',
            border: InputBorder.none,
            enabledBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
            filled: false,
            contentPadding: EdgeInsets.zero,
            suffixIcon: _query.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: () {
                      _searchController.clear();
                      setState(() => _query = '');
                    },
                  )
                : null,
          ),
          onChanged: (value) => setState(() => _query = value),
        ),
      ),
      body: _query.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.search, size: 64, color: theme.disabledColor),
                  const SizedBox(height: 16),
                  Text(
                    'Search across all your media',
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                    ),
                  ),
                ],
              ),
            )
          : filteredMedia.isEmpty
          ? Center(
              child: Text(
                'No results found for "$_query"',
                style: theme.textTheme.bodyLarge,
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: filteredMedia.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final media = filteredMedia[index];
                return InkWell(
                  onTap: () => context.push('/media-detail', extra: media),
                  borderRadius: BorderRadius.circular(12),
                  child: Row(
                    children: [
                      // Thumbnail
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: SizedBox(
                          width: 60,
                          height: 90,
                          child: media.imageUrl != null
                              ? Image.network(
                                  media.imageUrl!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, _, _) => Container(
                                    color: theme
                                        .colorScheme
                                        .surfaceContainerHighest,
                                    child: Center(
                                      child: Text(media.mediaType.emoji),
                                    ),
                                  ),
                                )
                              : Container(
                                  color:
                                      theme.colorScheme.surfaceContainerHighest,
                                  child: Center(
                                    child: Text(media.mediaType.emoji),
                                  ),
                                ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      // Details
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              media.title,
                              style: theme.textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(
                                  _getMediaIcon(media.mediaType),
                                  size: 16,
                                  color: theme.colorScheme.primary,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  media.mediaType.displayName,
                                  style: theme.textTheme.bodySmall?.copyWith(
                                    color: theme.colorScheme.onSurface
                                        .withValues(alpha: 0.7),
                                  ),
                                ),
                                if (media.userStats?.score != null) ...[
                                  const SizedBox(width: 12),
                                  const Icon(
                                    Icons.star_rounded,
                                    size: 16,
                                    color: Colors.amber,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    media.userStats!.score.toString(),
                                    style: theme.textTheme.bodySmall?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }

  IconData _getMediaIcon(MediaType type) {
    switch (type) {
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
}
