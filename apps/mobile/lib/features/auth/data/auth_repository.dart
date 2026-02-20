import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/services/secure_storage_service.dart';

part 'auth_repository.g.dart';

class AuthRepository {
  final FirebaseAuth _firebaseAuth;
  final SecureStorageService _secureStorage;

  AuthRepository(this._firebaseAuth, this._secureStorage);

  /// Stream of auth state changes
  Stream<User?> get authStateChanges => _firebaseAuth.authStateChanges();

  /// Get current user
  User? get currentUser => _firebaseAuth.currentUser;

  /// Check if user is logged in
  bool get isLoggedIn => _firebaseAuth.currentUser != null;

  /// Get current user's ID token for API calls
  Future<String?> getIdToken({bool forceRefresh = false}) async {
    final user = _firebaseAuth.currentUser;
    if (user == null) return null;
    return await user.getIdToken(forceRefresh);
  }

  /// Sign in with email and password
  Future<UserCredential> signInWithEmailAndPassword(
    String email,
    String password, {
    bool rememberMe = true,
  }) async {
    final credential = await _firebaseAuth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );

    // Save session to secure storage
    if (credential.user != null) {
      await _saveSession(credential.user!, rememberMe: rememberMe);
    }

    return credential;
  }

  /// Sign up with email and password
  Future<UserCredential> signUpWithEmailAndPassword(
    String email,
    String password,
  ) async {
    final credential = await _firebaseAuth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );

    // Save session to secure storage
    if (credential.user != null) {
      await _saveSession(credential.user!, rememberMe: true);
    }

    return credential;
  }

  /// Sign in with Google
  Future<UserCredential?> signInWithGoogle() async {
    try {
      final GoogleSignInAccount googleUser = await GoogleSignIn.instance
          .authenticate();

      final GoogleSignInAuthentication googleAuth = googleUser.authentication;

      final GoogleSignInClientAuthorization clientAuth = await googleUser
          .authorizationClient
          .authorizeScopes([]);

      final OAuthCredential credential = GoogleAuthProvider.credential(
        accessToken: clientAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final userCredential = await _firebaseAuth.signInWithCredential(
        credential,
      );

      // Save session to secure storage
      if (userCredential.user != null) {
        await _saveSession(userCredential.user!, rememberMe: true);
      }

      return userCredential;
    } catch (e) {
      rethrow;
    }
  }

  /// Sign out
  Future<void> signOut() async {
    // Clear secure storage session
    await _secureStorage.clearSession();

    // Sign out from Google
    try {
      await GoogleSignIn.instance.signOut();
    } catch (_) {
      // Ignore Google sign out errors
    }

    // Sign out from Firebase
    await _firebaseAuth.signOut();
  }

  /// Save session info to secure storage
  Future<void> _saveSession(User user, {required bool rememberMe}) async {
    final token = await user.getIdToken();
    await _secureStorage.saveSession(
      userId: user.uid,
      sessionToken: token,
      rememberMe: rememberMe,
    );
  }

  /// Check if we have a valid stored session
  Future<bool> hasValidSession() async {
    final storedUserId = await _secureStorage.getStoredUserId();
    final currentUser = _firebaseAuth.currentUser;

    if (storedUserId == null || currentUser == null) return false;

    return storedUserId == currentUser.uid;
  }

  /// Refresh token if needed
  Future<void> refreshTokenIfNeeded() async {
    final user = _firebaseAuth.currentUser;
    if (user == null) return;

    try {
      // Force token refresh
      await user.getIdToken(true);
    } catch (e) {
      // If token refresh fails, sign out
      await signOut();
    }
  }
}

@riverpod
AuthRepository authRepository(Ref ref) {
  final secureStorage = ref.watch(secureStorageServiceProvider);
  return AuthRepository(FirebaseAuth.instance, secureStorage);
}

@riverpod
Stream<User?> authState(Ref ref) {
  return ref.watch(authRepositoryProvider).authStateChanges;
}

/// Provider for checking if user is currently authenticated
@riverpod
bool isAuthenticated(Ref ref) {
  final authState = ref.watch(authStateProvider);
  return authState.valueOrNull != null;
}
