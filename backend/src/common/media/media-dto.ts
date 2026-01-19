export interface MediaDTO {
  id: string;
  title: string;
  imageUrl: string;
  origin?: string;
  genres?: string[];
  language?: string;
  createdAt: string;
  updatedAt: string;
  userStats: {
    score: number;
    status: string;
  };
}

export type CreateMediaDto<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateMediaDto<T> = Partial<CreateMediaDto<T>>;
