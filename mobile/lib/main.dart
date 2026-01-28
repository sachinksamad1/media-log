import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'core/theme/theme_provider.dart';
import 'core/error/error_logger.dart';
import 'core/error/widgets/custom_error_widget.dart';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  await Firebase.initializeApp();

  // Handle Flutter Errors
  FlutterError.onError = (details) {
    FlutterError.presentError(details); // Present to console
    ErrorLogger.logFlutterError(details);
  };

  // Handle Async Errors
  PlatformDispatcher.instance.onError = (error, stack) {
    ErrorLogger.logError(error, stack);
    return true;
  };

  // Build Error Widget
  ErrorWidget.builder = (FlutterErrorDetails details) {
    return CustomErrorWidget(errorDetails: details);
  };

  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(goRouterProvider);
    final themeMode = ref.watch(themeProvider);
    
    return MaterialApp.router(
      title: 'MediaLog',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
