export interface ApiResponse<T> {
  success: true;
  message?: string;
  data: T;
  meta?: {
    totalItems?: number;
    nextPageToken?: string | null;
  };
}

export const sendResponse = <T>(
  res: any, 
  statusCode: number, 
  data: T, 
  message?: string,
  meta?: any
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta
  };
  res.status(statusCode).json(response);
};