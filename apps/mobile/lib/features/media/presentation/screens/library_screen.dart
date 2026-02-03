import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../domain/media_types.dart';
import '../widgets/media_dashboard_tab.dart';

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
              IconButton(icon: const Icon(Icons.search), onPressed: () {}),
              IconButton(icon: const Icon(Icons.filter_list), onPressed: () {}),
            ],
            bottom: TabBar(
              controller: _tabController,
              isScrollable: true,
              tabAlignment: TabAlignment.start,
              tabs: _tabs
                  .map(
                    (tab) =>
                        Tab(icon: Icon(tab.icon), text: tab.type.displayName),
                  )
                  .toList(),
            ),
          ),
        ],
        body: TabBarView(
          controller: _tabController,
          children: _tabs.map((tab) => _buildMediaTab(tab.type)).toList(),
        ),
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 90),
        child: FloatingActionButton.extended(
          onPressed: () {
            final currentIndex = _tabController.index;
            final currentType = _tabs[currentIndex].type;
            context.push('/add-media', extra: currentType);
          },
          icon: const Icon(Icons.add),
          label: const Text('Add'),
        ),
      ),
    );
  }

  Widget _buildMediaTab(MediaType type) {
    return MediaDashboardTab(type: type);
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
