
export interface ApiResponse<T> {
  success: boolean | null; // o el tipo que corresponda si sabes que es boolean
  message: string;
  code: number;
  response: T;
}
