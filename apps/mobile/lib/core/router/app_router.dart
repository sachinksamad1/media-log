import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../features/auth/data/auth_repository.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/signup_screen.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/media/presentation/screens/media_detail_screen.dart';
import '../../features/media/presentation/screens/add_media_screen.dart';
import '../../features/media/presentation/screens/edit_media_screen.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/media/domain/media_types.dart';
import '../shell/main_shell.dart';

part 'app_router.g.dart';

@riverpod
GoRouter goRouter(Ref ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final currentPath = state.uri.path;

      // If auth is still loading, stay on splash
      if (authState.isLoading) {
        if (currentPath != '/splash') {
          return '/splash';
        }
        return null;
      }

      // If there's an error with auth, go to login
      if (authState.hasError) {
        if (currentPath != '/login' && currentPath != '/signup') {
          return '/login';
        }
        return null;
      }

      final isLoggedIn = authState.valueOrNull != null;
      final isOnAuthPage =
          currentPath == '/login' ||
          currentPath == '/signup' ||
          currentPath == '/splash';

      // Not logged in - redirect to login
      if (!isLoggedIn && !isOnAuthPage) {
        return '/login';
      }

      // Not logged in but on splash - go to login
      if (!isLoggedIn && currentPath == '/splash') {
        return '/login';
      }

      // Logged in but on auth page - redirect to home
      if (isLoggedIn && isOnAuthPage) {
        return '/';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(path: '/', builder: (context, state) => const MainShell()),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: '/media-detail',
        builder: (context, state) {
          final media = state.extra as BaseMedia;
          return MediaDetailScreen(media: media);
        },
      ),
      GoRoute(
        path: '/add-media',
        builder: (context, state) {
          final type = state.extra as MediaType;
          return AddMediaScreen(mediaType: type);
        },
      ),
      GoRoute(
        path: '/edit-media',
        builder: (context, state) {
          final media = state.extra as BaseMedia;
          return EditMediaScreen(media: media);
        },
      ),
    ],
  );
}
