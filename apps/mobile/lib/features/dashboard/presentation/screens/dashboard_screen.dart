import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../auth/data/auth_repository.dart';
import '../providers/dashboard_providers.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authRepositoryProvider).currentUser;
    final theme = Theme.of(context);
    final summaryAsync = ref.watch(librarySummaryProvider);
    final activitiesAsync = ref.watch(userActivityProvider);

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
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
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
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
            sliver: SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats Overview Cards
                  _buildSectionTitle(context, 'Overview'),
                  const SizedBox(height: 12),
                  summaryAsync.when(
                    data: (summary) {
                      // ignore: unchecked_use_of_nullable_value
                      final watching =
                          (summary.anime.ongoing) +
                          (summary.tvSeries.ongoing) +
                          (summary.movie.ongoing);
                      // ignore: unchecked_use_of_nullable_value
                      final reading =
                          (summary.manga.ongoing) +
                          (summary.lightNovel.ongoing) +
                          (summary.fiction.ongoing) +
                          (summary.nonFiction.ongoing);
                      // ignore: unchecked_use_of_nullable_value
                      final playing = (summary.game.ongoing);

                      // ignore: unchecked_use_of_nullable_value
                      final completed =
                          (summary.anime.completed) +
                          (summary.manga.completed) +
                          (summary.movie.completed) +
                          (summary.tvSeries.completed) +
                          (summary.fiction.completed) +
                          (summary.nonFiction.completed) +
                          (summary.lightNovel.completed) +
                          (summary.game.completed);

                      return Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: _buildStatCard(
                                  context,
                                  icon: Icons.tv_outlined,
                                  label: 'Watching',
                                  value: watching.toString(),
                                  color: Colors.purple,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _buildStatCard(
                                  context,
                                  icon: Icons.menu_book_outlined,
                                  label: 'Reading',
                                  value: reading.toString(),
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
                                  icon: Icons.games_outlined,
                                  label: 'Playing',
                                  value: playing.toString(),
                                  color: Colors.green,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _buildStatCard(
                                  context,
                                  icon: Icons.check_circle_outline,
                                  label: 'Completed',
                                  value: completed.toString(),
                                  color: Colors.blue,
                                ),
                              ),
                            ],
                          ),
                        ],
                      );
                    },
                    loading: () => const Center(
                      child: Padding(
                        padding: EdgeInsets.all(32.0),
                        child: CircularProgressIndicator(),
                      ),
                    ),
                    error: (error, stack) => Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.errorContainer,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Text(
                        'Failed to load stats: $error',
                        style: TextStyle(
                          color: theme.colorScheme.onErrorContainer,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Recent Activity
                  _buildSectionTitle(context, 'Recent Activity'),
                  const SizedBox(height: 12),
                  activitiesAsync.when(
                    data: (activities) {
                      if (activities.isEmpty) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 24.0),
                          child: Center(
                            child: Text(
                              'No recent activity',
                              style: theme.textTheme.bodyLarge?.copyWith(
                                color: theme.colorScheme.onSurface.withValues(
                                  alpha: 0.5,
                                ),
                              ),
                            ),
                          ),
                        );
                      }

                      return Column(
                        children: activities.map((activity) {
                          return _buildActivityCard(
                            context,
                            title: _getTitleForAction(
                              activity.action,
                              activity.resourceType,
                            ),
                            subtitle:
                                activity.resourceTitle ?? 'Unknown Resource',
                            icon: _getIconForAction(activity.action),
                            time: _formatTime(activity.createdAt),
                          );
                        }).toList(),
                      );
                    },
                    loading: () => const Center(
                      child: Padding(
                        padding: EdgeInsets.all(24.0),
                        child: CircularProgressIndicator(),
                      ),
                    ),
                    error: (error, stack) => Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.errorContainer,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Text(
                        'Failed to load activity: $error',
                        style: TextStyle(
                          color: theme.colorScheme.onErrorContainer,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Quick Actions
                  _buildSectionTitle(context, 'Quick Actions'),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _buildQuickActionChip(
                        context,
                        Icons.shuffle,
                        'Random Pick',
                        onTap: () => context.push('/random-pick'),
                      ),
                      _buildQuickActionChip(
                        context,
                        Icons.bar_chart,
                        'Statistics',
                        onTap: () => context.push('/stats'),
                      ),
                      _buildQuickActionChip(
                        context,
                        Icons.summarize_outlined,
                        'Reports',
                        onTap: () => context.push('/reports'),
                      ),
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
      style: Theme.of(
        context,
      ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
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
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.2), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
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
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
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
        color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
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
            child: Icon(icon, color: theme.colorScheme.primary, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
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
              color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionChip(
    BuildContext context,
    IconData icon,
    String label, {
    VoidCallback? onTap,
  }) {
    final theme = Theme.of(context);
    return ActionChip(
      avatar: Icon(icon, size: 18),
      label: Text(label),
      onPressed: onTap ?? () {},
      backgroundColor: theme.colorScheme.surfaceContainerHighest,
    );
  }

  String _formatTime(DateTime time) {
    final diff = DateTime.now().difference(time);
    if (diff.inDays > 1) return '${diff.inDays} days ago';
    if (diff.inDays == 1) return 'Yesterday';
    if (diff.inHours > 0) return '${diff.inHours} hours ago';
    if (diff.inMinutes > 0) return '${diff.inMinutes} minutes ago';
    return 'Just now';
  }

  IconData _getIconForAction(String action) {
    switch (action) {
      case 'CREATE':
        return Icons.add_circle_outline;
      case 'UPDATE':
        return Icons.edit_outlined;
      case 'DELETE':
        return Icons.delete_outline;
      case 'COMPLETE':
        return Icons.check_circle_outline;
      default:
        return Icons.notifications_outlined;
    }
  }

  String _getTitleForAction(String action, String resourceType) {
    switch (action) {
      case 'CREATE':
        return 'Added to $resourceType';
      case 'UPDATE':
        return 'Updated $resourceType';
      case 'DELETE':
        return 'Removed $resourceType';
      case 'COMPLETE':
        return 'Completed $resourceType';
      default:
        return 'Activity';
    }
  }
}
