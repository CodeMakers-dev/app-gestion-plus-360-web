
export interface ApiResponse<T> {
  success: boolean | null;
  message: string;
  code: number;
  response: T;
}
