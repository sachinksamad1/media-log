import { UserSchema, type User } from '@modules/users/users-schema.js';

/**
 * Generates a dummy user object that satisfies UserSchema.
 * You can override any field by passing an object.
 */
export const createMockUser = (
  overrides: Partial<Omit<User, "preferences">> & {
    preferences?: Partial<User["preferences"]>;
  } = {}
): User => {
  const defaultUser: Partial<User> = {
    uid: `test-uid-${Math.random().toString(36).substring(7)}`,
    username: "TestUser",
    email: `test-${Date.now()}@example.com`,
    displayName: "Test Display Name",
    avatarImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Test",
    lastLogin: new Date(),
  };

  // We use .parse() to ensure Zod fills in all the .default() values 
  // for preferences, privacy, and audit info.
  return UserSchema.parse({ ...defaultUser, ...overrides });
};