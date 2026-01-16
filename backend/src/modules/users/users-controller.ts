import type { Request, Response } from 'express';

import { UserMapper } from './mappers/user-mapper.js';
import { storageService } from './services/storage-service.js';
import { usersService } from './users-service.js';

export class UsersController {
  /**
   * Syncs the Firebase user with the local Firestore user document.
   * Call this endpoint after the user logs in on the client side.
   */
  async syncUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { uid, email } = req.user;

      if (!email) {
        res
          .status(400)
          .json({ success: false, error: 'User email is missing from token' });
        return;
      }

      // Merge data from the request body (e.g. displayName, avatar if new)
      const userData = req.body;

      const user = await usersService.syncUser(uid, email, userData);
      res.status(200).json({ success: true, data: UserMapper.toDto(user) });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error syncing user:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to sync user';
      res.status(400).json({ success: false, error: message });
    }
  }

  /**
   * Get the current authenticated user's profile.
   */
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const user = await usersService.getUser(req.user.uid);
      if (!user) {
        res
          .status(404)
          .json({ success: false, error: 'User profile not found' });
        return;
      }
      res.status(200).json({ success: true, data: UserMapper.toDto(user) });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching user profile:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  }

  /**
   * Update the current authenticated user's profile.
   */
  async updateMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const updated = await usersService.updateUser(req.user.uid, req.body);
      res.status(200).json({ success: true, data: UserMapper.toDto(updated) });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating user profile:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  }
  /**
   * Upload user avatar.
   */
  async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ success: false, error: 'No file uploaded' });
        return;
      }

      const publicUrl = await storageService.uploadAvatar(
        req.user.uid,
        req.file,
      );

      // Update user profile with new avatar URL
      const updatedUser = await usersService.updateUser(req.user.uid, {
        avatarImg: publicUrl,
      });

      res
        .status(200)
        .json({ success: true, data: UserMapper.toDto(updatedUser) });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error uploading avatar:', error);
      const message = error instanceof Error ? error.message : 'Upload failed';
      res.status(500).json({ success: false, error: message });
    }
  }

  /**
   * Register a new user (Auth + Firestore).
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username, displayName } = req.body;

      if (!email || !password || !username) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: email, password, username',
        });
        return;
      }

      const newUser = await usersService.registerUser({
        email,
        password,
        username,
        displayName,
      });
      res.status(201).json({ success: true, data: UserMapper.toDto(newUser) });
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error registering user:', error);
      // Firebase Admin Auth errors usually have a code/message
      const message =
        error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({ success: false, error: message });
    }
  }
  /**
   * Recover username.
   */
  async recoverUsername(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ success: false, error: 'Email is required' });
        return;
      }

      await usersService.recoverUsername(email);
      res.status(200).json({
        success: true,
        message:
          'If an account exists, the username has been sent to your email.',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error recovering username:', error);
      const message =
        error instanceof Error ? error.message : 'Recovery failed';
      res.status(400).json({ success: false, error: message });
    }
  }
}

export const usersController = new UsersController();
