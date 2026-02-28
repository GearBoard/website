export type SuccessResponseDto<T> = {
  success: true;
  data: T;
  message: string;
};

export type ErrorResponseDto = {
  success: false;
  message: string;
};

export type ApiResponseDto<T> = SuccessResponseDto<T> | ErrorResponseDto;

export function successResponse<T>(data: T, message: string): SuccessResponseDto<T> {
  return { success: true, data, message };
}

export function errorResponse(message: string): ErrorResponseDto {
  return { success: false, message };
}
