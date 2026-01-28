import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/media/presentation/screens/library_screen.dart';
import '../../features/media/presentation/screens/search_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';



final selectedTabProvider = StateProvider<int>((ref) => 0);

class MainShell extends ConsumerWidget {
  const MainShell({super.key});

  static const List<Widget> _screens = [
    DashboardScreen(),
    SearchScreen(),
    LibraryScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedIndex = ref.watch(selectedTabProvider);
    final theme = Theme.of(context);

    return Scaffold(
      extendBody: true,
      body: IndexedStack(
        index: selectedIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        elevation: 0,
        selectedIndex: selectedIndex,
        onDestinationSelected: (index) {
          ref.read(selectedTabProvider.notifier).state = index;
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.search_outlined),
            selectedIcon: Icon(Icons.search),
            label: 'Search',
          ),
          NavigationDestination(
            icon: Icon(Icons.video_library_outlined),
            selectedIcon: Icon(Icons.video_library),
            label: 'Library',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
        indicatorColor: theme.colorScheme.primaryContainer,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      ),
    );
  }
}
