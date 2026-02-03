import type { UserDto } from '@modules/users/dtos/user-dto.js';
import type { User } from '@modules/users/users-schema.js';
import type { Timestamp } from 'firebase-admin/firestore';

export class UserMapper {
  static toDto(user: User): UserDto {
    const createdAtDate = UserMapper.toDate(user.createdAt);
    const updatedAtDate = UserMapper.toDate(user.updatedAt);

    return {
      uid: user.uid,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatarImg: user.avatarImg,
      preferences: user.preferences,
      privacy: user.privacy,
      createdAt: createdAtDate.toISOString(),
      updatedAt: updatedAtDate.toISOString(),
      joinedDate: UserMapper.formatDate(createdAtDate),
    };
  }

  private static toDate(val: Date | Timestamp | string | undefined): Date {
    if (!val) return new Date();
    if (val instanceof Date) return val;
    if (
      typeof val === 'object' &&
      'toDate' in val &&
      typeof val.toDate === 'function'
    ) {
      return val.toDate(); // Handle Firestore Timestamp
    }
    if (typeof val === 'string') return new Date(val);
    return new Date(); // Fallback
  }

  private static formatDate(date: Date): string {
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch {
      return date.toISOString();
    }
  }
}
