import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/media/presentation/screens/library_screen.dart';
import '../../features/media/presentation/screens/search_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';

import '../theme/app_colors.dart';

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
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.transparent, AppColors.navBackground],
          ),
        ),
        child: NavigationBar(
          elevation: 0,
          selectedIndex: selectedIndex,
          onDestinationSelected: (index) {
            ref.read(selectedTabProvider.notifier).state = index;
          },
          destinations: const [
            NavigationDestination(
              icon: Icon(
                Icons.dashboard_outlined,
                color: AppColors.navDashboard,
              ),
              selectedIcon: Icon(
                Icons.dashboard,
                color: AppColors.navDashboard,
              ),
              label: 'Dashboard',
            ),
            NavigationDestination(
              icon: Icon(Icons.search_outlined, color: AppColors.navSearch),
              selectedIcon: Icon(Icons.search, color: AppColors.navSearch),
              label: 'Search',
            ),
            NavigationDestination(
              icon: Icon(
                Icons.video_library_outlined,
                color: AppColors.navLibrary,
              ),
              selectedIcon: Icon(
                Icons.video_library,
                color: AppColors.navLibrary,
              ),
              label: 'Library',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline, color: AppColors.navProfile),
              selectedIcon: Icon(Icons.person, color: AppColors.navProfile),
              label: 'Profile',
            ),
          ],
          backgroundColor: Colors.transparent,
          indicatorColor: theme.colorScheme.primaryContainer,
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        ),
      ),
    );
  }
}
