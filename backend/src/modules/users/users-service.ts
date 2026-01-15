import { emailService } from '../../common/email/email.service.js';
import { auth, db } from '../../config/firebase.js';

import { UserSchema } from './users-schema.js';
import type { User } from './users-schema.js';

const USERS_COLLECTION = 'users';

export class UsersService {
  /**
   * Get a user by their Firebase UID.
   */
  async getUser(uid: string): Promise<User | null> {
    const doc = await db.collection(USERS_COLLECTION).doc(uid).get();
    if (!doc.exists) {
      return null;
    }
    // We assume the data in Firestore matches the schema,
    // but we could parse it if we wanted strict runtime checks.
    return doc.data() as User;
  }

  /**
   * Create or overwrite a user document.
   * This ensures the user exists in our database after they sign up in Firebase.
   */
  async syncUser(
    uid: string,
    email: string,
    data?: Partial<User>,
  ): Promise<User> {
    const userRef = db.collection(USERS_COLLECTION).doc(uid);
    const doc = await userRef.get();

    if (doc.exists) {
      // If user exists, we might want to update some fields or just return it.
      // For now, let's just return exists.
      // Or if data is provided, update it.
      if (data) {
        await userRef.update({
          ...data,
          updatedAt: new Date(),
        });
        const updated = await userRef.get();
        return updated.data() as User;
      }
      return doc.data() as User;
    }

    // New User
    const newUser: User = UserSchema.parse({
      uid,
      email,
      username: data?.username || email.split('@')[0], // Fallback username
      displayName: data?.displayName || '',
      avatarImg: data?.avatarImg || '',
      ...data,
      privacy: { ...data?.privacy },
      preferences: { ...data?.preferences },
      // Schema defaults will handle the rest if we parse it,
      // but UserSchema.parse requires all fields unless optional/default.
      // UserSchema has defaults for many fields.
    });

    // We need to be careful with parse throwing if something is missing.
    // The schema requires: uid, username, email. Others are optional or have defaults.

    await userRef.set(newUser);
    return newUser;
  }

  /**
   * Update an existing user.
   */
  async updateUser(uid: string, data: Partial<User>): Promise<User> {
    const userRef = db.collection(USERS_COLLECTION).doc(uid);

    // We update only the fields provided.
    // We should probably validate 'data' against a partial schema if we want strictness.
    await userRef.update({
      ...data,
      updatedAt: new Date(),
    });

    const doc = await userRef.get();
    return doc.data() as User;
  }
  /**
   * Check if username or email is already taken.
   */
  async checkAvailability(username: string, email: string): Promise<void> {
    // 1. Check Username in Firestore
    const usernameSnapshot = await db
      .collection(USERS_COLLECTION)
      .where('username', '==', username)
      .limit(1)
      .get();

    if (!usernameSnapshot.empty) {
      throw new Error('Username is already taken');
    }

    // 2. Check Email in Firebase Auth
    // Note: auth.createUser checks this automatically, but checking here gives us a consistent error handling flow
    // and avoids a partial failure state if we relied on the subsequent call.
    try {
      await auth.getUserByEmail(email);
      // If no error, it means user exists
      throw new Error('Email is already in use');
    } catch (error: unknown) {
      // Check if it's a generic Error or a FirebaseError with a 'code' property
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code: string }).code === 'auth/user-not-found'
      ) {
        // Email is available
        return;
      }
      // Re-throw if it's our error or a different Firebase error
      throw error;
    }
  }

  /**
   * Register a new user: Create in Firebase Auth + Create in Firestore
   */
  async registerUser(params: {
    email: string;
    password: string;
    username: string;
    displayName?: string;
  }): Promise<User> {
    const { email, password, username, displayName } = params;

    // 0. Validate Availability
    await this.checkAvailability(username, email);

    // 1. Create User in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: displayName || username,
    });

    // 2. Create User Profile in Firestore
    const newUser: User = UserSchema.parse({
      uid: userRecord.uid,
      email: userRecord.email,
      username,
      displayName: displayName || username,
      avatarImg: userRecord.photoURL || '',
    });

    await db.collection(USERS_COLLECTION).doc(newUser.uid).set(newUser);

    return newUser;
  }
  /**
   * Recover username by email.
   */
  async recoverUsername(email: string): Promise<void> {
    const snapshot = await db
      .collection(USERS_COLLECTION)
      .where('email', '==', email)
      .limit(1)
      .get();

    const [userDoc] = snapshot.docs;

    if (!userDoc) {
      // For security, we might want to return silently, but for UX, we'll throw.
      throw new Error('No account found with this email');
    }

    const user = userDoc.data() as User;
    const username = user.username;

    if (!username) {
      throw new Error('User has no username');
    }

    await emailService.sendUsernameRecovery(email, username);
  }
}

export const usersService = new UsersService();
