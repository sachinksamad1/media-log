export interface UserDto {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  avatarImg?: string;
  joinedDate: string;
  createdAt: string; // Keeping raw just in case
}
