import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'secure_storage_service.g.dart';

/// Keys for secure storage
class StorageKeys {
  static const String lastLoginTime = 'last_login_time';
  static const String sessionToken = 'session_token';
  static const String userId = 'user_id';
  static const String rememberMe = 'remember_me';
}

/// Service for secure storage operations
class SecureStorageService {
  final FlutterSecureStorage _storage;

  SecureStorageService()
    : _storage = const FlutterSecureStorage(
        aOptions: AndroidOptions(),
        iOptions: IOSOptions(
          accessibility: KeychainAccessibility.first_unlock_this_device,
        ),
      );

  /// Save a value securely
  Future<void> write(String key, String value) async {
    await _storage.write(key: key, value: value);
  }

  /// Read a value from secure storage
  Future<String?> read(String key) async {
    return await _storage.read(key: key);
  }

  /// Delete a value from secure storage
  Future<void> delete(String key) async {
    await _storage.delete(key: key);
  }

  /// Delete all values from secure storage
  Future<void> deleteAll() async {
    await _storage.deleteAll();
  }

  /// Check if a key exists
  Future<bool> containsKey(String key) async {
    return await _storage.containsKey(key: key);
  }

  // Session-specific methods

  /// Save session info when user logs in
  Future<void> saveSession({
    required String userId,
    String? sessionToken,
    bool rememberMe = true,
  }) async {
    await write(StorageKeys.userId, userId);
    await write(StorageKeys.lastLoginTime, DateTime.now().toIso8601String());
    await write(StorageKeys.rememberMe, rememberMe.toString());
    if (sessionToken != null) {
      await write(StorageKeys.sessionToken, sessionToken);
    }
  }

  /// Clear session info when user logs out
  Future<void> clearSession() async {
    await delete(StorageKeys.userId);
    await delete(StorageKeys.sessionToken);
    await delete(StorageKeys.lastLoginTime);
    // Keep rememberMe preference
  }

  /// Check if user should remain logged in
  Future<bool> shouldRememberUser() async {
    final rememberMe = await read(StorageKeys.rememberMe);
    return rememberMe == 'true';
  }

  /// Get last login time
  Future<DateTime?> getLastLoginTime() async {
    final timeStr = await read(StorageKeys.lastLoginTime);
    if (timeStr == null) return null;
    return DateTime.tryParse(timeStr);
  }

  /// Get stored user ID
  Future<String?> getStoredUserId() async {
    return await read(StorageKeys.userId);
  }
}

@riverpod
SecureStorageService secureStorageService(Ref ref) {
  return SecureStorageService();
}
