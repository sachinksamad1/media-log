// 1. Standardizing all API responses
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    nextCursor?: string | null;
  };
}

// 2. Defining what every database document must have
export interface IBaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 3. Environment variable types
export type Environment = 'development' | 'production' | 'test';