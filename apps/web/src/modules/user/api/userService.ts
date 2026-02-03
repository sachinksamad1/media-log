import http from '@/common/api/http'
import type { UserDto } from '../dtos/user.dto'
import { UserMapper } from '../mappers/user.mapper'

// The backend UserSchema structure:
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  accentColor: string
  language: string
  defaultView: 'grid' | 'list' | 'compact'
  itemsPerPage: number
}

export interface UserPrivacy {
  isPublic: boolean
  showAdultContent: boolean
  showDetailedStats: boolean
}

export interface UserEntity {
  uid: string
  username: string
  email: string
  displayName?: string
  avatarImg?: string
  preferences?: UserPreferences
  privacy?: UserPrivacy
  createdAt?: string
}

export const userService = {
  /**
   * Sync the Firebase user with the backend database.
   * Can also be used to update user details on login/signup.
   */
  async syncUser(userData?: Partial<UserEntity>): Promise<UserDto> {
    // The backend extracts uid/email from the token in the 'protect' middleware.
    // userData is the body.
    const response = await http.post<{ success: boolean; data: UserEntity }>(
      '/users/sync',
      userData
    )
    return UserMapper.toDto(response.data.data)
  },

  async getMe(): Promise<UserDto> {
    const response = await http.get<{ success: boolean; data: UserEntity }>('/users/me')
    return UserMapper.toDto(response.data.data)
  },

  async updateMe(data: Partial<UserEntity>): Promise<UserDto> {
    const response = await http.patch<{ success: boolean; data: UserEntity }>('/users/me', data)
    return UserMapper.toDto(response.data.data)
  },

  async uploadAvatar(file: File): Promise<UserDto> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await http.post<{ success: boolean; data: UserEntity }>(
      '/users/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return UserMapper.toDto(response.data.data)
  },

  async recoverUsername(email: string): Promise<void> {
    await http.post('/users/recover/username', { email })
  },
}
