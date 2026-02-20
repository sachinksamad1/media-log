import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../domain/media_types.dart';
import '../../data/media_repository.dart';
import '../widgets/media_card.dart';

// Pagination State
class PaginationState<T> {
  final List<T> items;
  final String? nextCursor;
  final bool isLoading;
  final bool hasMore;

  PaginationState({
    required this.items,
    this.nextCursor,
    this.isLoading = false,
    this.hasMore = true,
  });

  PaginationState<T> copyWith({
    List<T>? items,
    String? nextCursor,
    bool? isLoading,
    bool? hasMore,
  }) {
    return PaginationState<T>(
      items: items ?? this.items,
      nextCursor: nextCursor ?? this.nextCursor,
      isLoading: isLoading ?? this.isLoading,
      hasMore: hasMore ?? this.hasMore,
    );
  }
}

// Pagination Notifier
class PaginationNotifier<T extends BaseMedia>
    extends StateNotifier<PaginationState<T>> {
  final MediaRepository _repo;
  final MediaType _type;

  PaginationNotifier(this._repo, this._type)
    : super(PaginationState(items: [])) {
    loadNextPage();
  }

  Future<void> loadNextPage() async {
    if (state.isLoading || !state.hasMore) return;

    state = state.copyWith(isLoading: true);

    try {
      final result = await _repo.fetchMedia<T>(
        _type,
        limit: 20,
        cursor: state.nextCursor,
        // We fetch "all others" - simplified to just all for now as strict exclusion is hard
      );

      state = state.copyWith(
        items: [...state.items, ...result.items],
        nextCursor: result.nextCursor,
        isLoading: false,
        hasMore: result.nextCursor != null,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false);
      // Handle error cleanly in UI
    }
  }
}

// Providers
// We need a family of providers to store state per tab
final mediaPaginationProvider =
    StateNotifierProvider.family<
      PaginationNotifier<BaseMedia>,
      PaginationState<BaseMedia>,
      MediaType
    >((ref, type) {
      final repo = ref.watch(mediaRepositoryProvider);
      return PaginationNotifier(repo, type);
    });

final carouselProvider = FutureProvider.family<List<BaseMedia>, MediaType>((
  ref,
  type,
) async {
  final repo = ref.watch(mediaRepositoryProvider);

  String activeStatus;
  String plannedStatus;

  switch (type) {
    case MediaType.anime:
    case MediaType.movie:
    case MediaType.tvSeries:
      activeStatus = 'Watching';
      plannedStatus = 'Plan to Watch';
      break;
    case MediaType.manga:
    case MediaType.lightNovel:
    case MediaType.fiction:
    case MediaType.nonFiction:
      activeStatus = 'Reading';
      plannedStatus = 'Plan to Read';
      break;
    case MediaType.game:
      activeStatus = 'Playing';
      plannedStatus = 'Plan to Play';
      break;
  }

  // Fetch Active
  final activeResult = await repo.fetchMedia(
    type,
    status: activeStatus,
    limit: 10,
  );

  // Fetch Planned
  final plannedResult = await repo.fetchMedia(
    type,
    status: plannedStatus,
    limit: 10,
  );

  // We can also try fetching legacy generic statuses if needed, but sticking to specific for now.
  return [...activeResult.items, ...plannedResult.items];
});

class MediaDashboardTab extends ConsumerWidget {
  final MediaType type;

  const MediaDashboardTab({super.key, required this.type});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final paginationState = ref.watch(mediaPaginationProvider(type));
    final carouselAsync = ref.watch(carouselProvider(type));

    return NotificationListener<ScrollNotification>(
      onNotification: (scrollInfo) {
        if (scrollInfo.metrics.pixels >=
            scrollInfo.metrics.maxScrollExtent * 0.8) {
          ref.read(mediaPaginationProvider(type).notifier).loadNextPage();
        }
        return false;
      },
      child: CustomScrollView(
        slivers: [
          // Carousel Section
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: Text(
                    _getCarouselTitle(type),
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                SizedBox(
                  height: 240,
                  child: carouselAsync.when(
                    data: (items) {
                      if (items.isEmpty) {
                        return Center(
                          child: Text(
                            'No active media',
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: Colors.grey,
                            ),
                          ),
                        );
                      }
                      return ListView.separated(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        scrollDirection: Axis.horizontal,
                        itemCount: items.length,
                        separatorBuilder: (_, _) => const SizedBox(width: 12),
                        itemBuilder: (context, index) {
                          return SizedBox(
                            width: 140,
                            child: MediaCard(
                              media: items[index],
                              onTap: () => context.push(
                                '/media-detail',
                                extra: items[index],
                              ),
                              backgroundColor: Colors.transparent,
                            ),
                          );
                        },
                      );
                    },
                    loading: () =>
                        const Center(child: CircularProgressIndicator()),
                    error: (e, _) => const Center(child: Icon(Icons.error)),
                  ),
                ),
              ],
            ),
          ),

          // Divider
          SliverToBoxAdapter(
            child: Divider(
              height: 32,
              indent: 16,
              endIndent: 16,
              color: theme.colorScheme.outline.withValues(alpha: 0.1),
            ),
          ),

          // Top Picks Header
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Text(
                'Top Picks',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),

          // Paginated Grid
          if (paginationState.items.isEmpty && paginationState.isLoading)
            const SliverToBoxAdapter(
              child: Center(
                child: Padding(
                  padding: EdgeInsets.all(32.0),
                  child: CircularProgressIndicator(),
                ),
              ),
            )
          else if (paginationState.items.isEmpty)
            const SliverToBoxAdapter(
              child: Center(
                child: Padding(
                  padding: EdgeInsets.all(32.0),
                  child: Text('No items found'),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  childAspectRatio: 0.55,
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                ),
                delegate: SliverChildBuilderDelegate((context, index) {
                  return MediaCard(
                    media: paginationState.items[index],
                    onTap: () => context.push(
                      '/media-detail',
                      extra: paginationState.items[index],
                    ),
                  );
                }, childCount: paginationState.items.length),
              ),
            ),

          // Loading footer
          if (paginationState.isLoading && paginationState.items.isNotEmpty)
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Center(child: CircularProgressIndicator()),
              ),
            ),

          const SliverPadding(
            padding: EdgeInsets.only(bottom: 80),
          ), // Fab space
        ],
      ),
    );
  }

  String _getCarouselTitle(MediaType type) {
    switch (type) {
      case MediaType.anime:
      case MediaType.movie:
      case MediaType.tvSeries:
        return 'Watching & Planned';
      case MediaType.manga:
      case MediaType.lightNovel:
      case MediaType.fiction:
      case MediaType.nonFiction:
        return 'Reading & Planned';
      case MediaType.game:
        return 'Playing & Planned';
    }
  }
}
