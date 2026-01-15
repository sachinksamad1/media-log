import type { UserDto } from "../dtos/user.dto";
import type { UserEntity } from "../api/userService";

export class UserMapper {
  static toDto(entity: UserEntity): UserDto {
    return {
      uid: entity.uid,
      username: entity.username,
      email: entity.email,
      displayName: entity.displayName || entity.username,
      avatarImg: entity.avatarImg,
      createdAt: entity.createdAt || new Date().toISOString(),
      joinedDate: UserMapper.formatDate(entity.createdAt),
    };
  }

  private static formatDate(dateString?: string): string {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  }
}
