export type SuccessResponseDto<T> = {
  success: true;
  data: T;
};

export type ErrorResponseDto = {
  success: false;
  message: string;
};

export type ApiResponseDto<T> = SuccessResponseDto<T> | ErrorResponseDto;

export function successResponse<T>(data: T): SuccessResponseDto<T> {
  return { success: true, data };
}

export function errorResponse(message: string): ErrorResponseDto {
  return { success: false, message };
}
