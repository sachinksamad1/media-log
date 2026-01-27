import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/media_repository.dart';
import '../../domain/media_types.dart';
import '../widgets/media_card.dart';

class LibraryScreen extends ConsumerStatefulWidget {
  const LibraryScreen({super.key});

  @override
  ConsumerState<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends ConsumerState<LibraryScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;

  final List<_MediaTab> _tabs = [
    _MediaTab(
      type: MediaType.anime,
      icon: Icons.movie_outlined,
      selectedIcon: Icons.movie,
    ),
    _MediaTab(
      type: MediaType.manga,
      icon: Icons.menu_book_outlined,
      selectedIcon: Icons.menu_book,
    ),
    _MediaTab(
      type: MediaType.lightNovel,
      icon: Icons.auto_stories_outlined,
      selectedIcon: Icons.auto_stories,
    ),
    _MediaTab(
      type: MediaType.fiction,
      icon: Icons.book_outlined,
      selectedIcon: Icons.book,
    ),
    _MediaTab(
      type: MediaType.nonFiction,
      icon: Icons.library_books_outlined,
      selectedIcon: Icons.library_books,
    ),
    _MediaTab(
      type: MediaType.movie,
      icon: Icons.theaters_outlined,
      selectedIcon: Icons.theaters,
    ),
    _MediaTab(
      type: MediaType.tvSeries,
      icon: Icons.tv_outlined,
      selectedIcon: Icons.tv,
    ),
    _MediaTab(
      type: MediaType.game,
      icon: Icons.games_outlined,
      selectedIcon: Icons.games,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) => [
          SliverAppBar(
            floating: true,
            pinned: true,
            title: const Text('Library'),
            actions: [
              IconButton(
                icon: const Icon(Icons.search),
                onPressed: () {},
              ),
              IconButton(
                icon: const Icon(Icons.filter_list),
                onPressed: () {},
              ),
            ],
            bottom: TabBar(
              controller: _tabController,
              isScrollable: true,
              tabAlignment: TabAlignment.start,
              tabs: _tabs.map((tab) => Tab(
                icon: Icon(tab.icon),
                text: tab.type.displayName,
              )).toList(),
            ),
          ),
        ],
        body: TabBarView(
          controller: _tabController,
          children: _tabs.map((tab) => _buildMediaTab(tab.type)).toList(),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        icon: const Icon(Icons.add),
        label: const Text('Add'),
      ),
    );
  }

  Widget _buildMediaTab(MediaType type) {
    return switch (type) {
      MediaType.anime => _buildGrid(
          ref.watch(animeListProvider),
          Icons.movie_outlined,
          'No Anime Found',
          'Add anime to your library',
          () => ref.invalidate(animeListProvider),
        ),
      MediaType.manga => _buildGrid(
          ref.watch(mangaListProvider),
          Icons.menu_book_outlined,
          'No Manga Found',
          'Add manga to your library',
          () => ref.invalidate(mangaListProvider),
        ),
      MediaType.lightNovel => _buildGrid(
          ref.watch(lightNovelListProvider),
          Icons.auto_stories_outlined,
          'No Light Novels Found',
          'Add light novels to your library',
          () => ref.invalidate(lightNovelListProvider),
        ),
      MediaType.fiction => _buildGrid(
          ref.watch(fictionListProvider),
          Icons.book_outlined,
          'No Fiction Found',
          'Add fiction books to your library',
          () => ref.invalidate(fictionListProvider),
        ),
      MediaType.nonFiction => _buildGrid(
          ref.watch(nonFictionListProvider),
          Icons.library_books_outlined,
          'No Non-Fiction Found',
          'Add non-fiction books to your library',
          () => ref.invalidate(nonFictionListProvider),
        ),
      MediaType.movie => _buildGrid(
          ref.watch(movieListProvider),
          Icons.theaters_outlined,
          'No Movies Found',
          'Add movies to your library',
          () => ref.invalidate(movieListProvider),
        ),
      MediaType.tvSeries => _buildGrid(
          ref.watch(tvSeriesListProvider),
          Icons.tv_outlined,
          'No TV Series Found',
          'Add TV series to your library',
          () => ref.invalidate(tvSeriesListProvider),
        ),
      MediaType.game => _buildGrid(
          ref.watch(gameListProvider),
          Icons.games_outlined,
          'No Games Found',
          'Add games to your library',
          () => ref.invalidate(gameListProvider),
        ),
    };
  }

  Widget _buildGrid<T extends BaseMedia>(
    AsyncValue<List<T>> asyncValue,
    IconData emptyIcon,
    String emptyMessage,
    String emptySubMessage,
    VoidCallback onRetry,
  ) {
    final theme = Theme.of(context);

    return asyncValue.when(
      data: (items) {
        if (items.isEmpty) {
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
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
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
          itemCount: items.length,
          itemBuilder: (context, index) {
            return MediaCard(media: items[index]);
          },
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stack) => Center(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 48, color: theme.colorScheme.error),
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
                  color: theme.colorScheme.onSurface.withOpacity(0.6),
                ),
              ),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MediaTab {
  final MediaType type;
  final IconData icon;
  final IconData selectedIcon;

  _MediaTab({
    required this.type,
    required this.icon,
    required this.selectedIcon,
  });
}
