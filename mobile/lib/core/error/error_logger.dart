
import 'dart:async';
import 'package:flutter/foundation.dart';

class ErrorLogger {
  static void logError(Object error, StackTrace? stackTrace) {
    if (kDebugMode) {
      print('🔴 Error: $error');
      if (stackTrace != null) {
        print('Stack trace:\n$stackTrace');
      }
    } else {
      // In production, report to Crashlytics or Sentry
      // FirebaseCrashlytics.instance.recordError(error, stackTrace);
    }
  }

  static void logFlutterError(FlutterErrorDetails details) {
    if (kDebugMode) {
      FlutterError.dumpErrorToConsole(details);
    } else {
      Zone.current.handleUncaughtError(details.exception, details.stack!);
    }
  }
}
