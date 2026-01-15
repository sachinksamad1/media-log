export interface UserDto {
  uid: string;
  username: string;
  email: string;
  displayName?: string;
  avatarImg?: string;
  preferences?: any;
  privacy?: any;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  joinedDate: string; // Human Readable
}
