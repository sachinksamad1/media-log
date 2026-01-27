import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/data/auth_repository.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authRepositoryProvider).currentUser;
    final theme = Theme.of(context);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar.large(
            title: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Welcome back,',
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
                Text(
                  user?.displayName ?? user?.email?.split('@').first ?? 'User',
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                onPressed: () {},
              ),
              const SizedBox(width: 8),
            ],
          ),
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats Overview Cards
                  _buildSectionTitle(context, 'Overview'),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          context,
                          icon: Icons.movie_outlined,
                          label: 'Anime',
                          value: '12',
                          color: Colors.purple,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          context,
                          icon: Icons.menu_book_outlined,
                          label: 'Manga',
                          value: '8',
                          color: Colors.orange,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          context,
                          icon: Icons.book_outlined,
                          label: 'Light Novels',
                          value: '5',
                          color: Colors.blue,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          context,
                          icon: Icons.games_outlined,
                          label: 'Games',
                          value: '15',
                          color: Colors.green,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Recent Activity
                  _buildSectionTitle(context, 'Recent Activity'),
                  const SizedBox(height: 12),
                  _buildActivityCard(
                    context,
                    title: 'Started watching',
                    subtitle: 'Attack on Titan Final Season',
                    icon: Icons.play_arrow_rounded,
                    time: '2 hours ago',
                  ),
                  _buildActivityCard(
                    context,
                    title: 'Completed',
                    subtitle: 'Jujutsu Kaisen Season 2',
                    icon: Icons.check_circle_outline,
                    time: 'Yesterday',
                  ),
                  _buildActivityCard(
                    context,
                    title: 'Added to library',
                    subtitle: 'One Piece Volume 106',
                    icon: Icons.add_circle_outline,
                    time: '3 days ago',
                  ),
                  const SizedBox(height: 24),

                  // Quick Actions
                  _buildSectionTitle(context, 'Quick Actions'),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _buildQuickActionChip(context, Icons.add, 'Add Media'),
                      _buildQuickActionChip(context, Icons.search, 'Search'),
                      _buildQuickActionChip(context, Icons.shuffle, 'Random Pick'),
                      _buildQuickActionChip(context, Icons.bar_chart, 'Statistics'),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Text(
      title,
      style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
          ),
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.onSurface,
            ),
          ),
          Text(
            label,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required String time,
  }) {
    final theme = Theme.of(context);
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: theme.colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              icon,
              color: theme.colorScheme.primary,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                  ),
                ),
                Text(
                  subtitle,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Text(
            time,
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurface.withOpacity(0.5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionChip(BuildContext context, IconData icon, String label) {
    final theme = Theme.of(context);
    return ActionChip(
      avatar: Icon(icon, size: 18),
      label: Text(label),
      onPressed: () {},
      backgroundColor: theme.colorScheme.surfaceContainerHighest,
    );
  }
}
