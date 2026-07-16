export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  total?: number;
  message?: string;
}

export function apiResponse<T>(data: T, total?: number): ApiResponse<T> {
  const response: ApiResponse<T> = { success: true, data };
  if (total !== undefined) response.total = total;
  return response;
}

export function apiMessage(message: string): ApiResponse<null> {
  return { success: true, data: null, message };
}
