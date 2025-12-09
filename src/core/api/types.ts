/**
 * API Error Types
 */

/**
 * API Error class with additional context
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  static fromTauriError(error: unknown): ApiError {
    if (error instanceof ApiError) return error;
    
    if (error instanceof Error) {
      return new ApiError(error.message, "TAURI_ERROR", undefined, error);
    }
    
    if (typeof error === "string") {
      return new ApiError(error, "TAURI_ERROR");
    }
    
    return new ApiError("Unknown error occurred", "UNKNOWN_ERROR", undefined, error);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
    };
  }
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * API Request options
 */
export interface ApiRequestOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
}
