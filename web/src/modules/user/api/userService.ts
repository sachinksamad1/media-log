import http from '@/common/api/http';
// We will use UserProfile defined below


// Assuming the backend returns the user object directly in data
// The backend UserSchema structure:
import type { UserDto } from "../dtos/user.dto";
import { UserMapper } from "../mappers/user.mapper";

// The backend UserSchema structure:
export interface UserEntity {
  uid: string;
  username: string;
  email: string;
  displayName?: string;
  avatarImg?: string;
  preferences?: any;
  privacy?: any;
  createdAt?: string;
}

export const userService = {
  /**
   * Sync the Firebase user with the backend database.
   * Can also be used to update user details on login/signup.
   */
  async syncUser(userData?: Partial<UserEntity>): Promise<UserDto> {
    // The backend extracts uid/email from the token in the 'protect' middleware.
    // userData is the body.
    const response = await http.post<{ success: boolean; data: UserEntity }>('/users/sync', userData);
    return UserMapper.toDto(response.data.data);
  },

  async getMe(): Promise<UserDto> {
    const response = await http.get<{ success: boolean; data: UserEntity }>('/users/me');
    return UserMapper.toDto(response.data.data);
  },

  async updateMe(data: Partial<UserEntity>): Promise<UserDto> {
    const response = await http.patch<{ success: boolean; data: UserEntity }>('/users/me', data);
    return UserMapper.toDto(response.data.data);
  },

  async uploadAvatar(file: File): Promise<UserDto> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await http.post<{ success: boolean; data: UserEntity }>("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return UserMapper.toDto(response.data.data);
  }
};
