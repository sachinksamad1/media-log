export interface UserDto {
  uid: string;
  username: string;
  email: string;
  displayName?: string;
  avatarImg?: string;
  preferences?: unknown;
  privacy?: unknown;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  joinedDate: string; // Human Readable
}
