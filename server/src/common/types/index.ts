export interface ApiResponse<T = any> {
  message: string;
  success: boolean;
  data?: T;
}
