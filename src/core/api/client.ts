/**
 * Core API Client
 * Base client for making API calls - can be extended for REST, GraphQL, or Tauri invoke
 */
import { invoke } from "@tauri-apps/api/core";

// ============================================================================
// Types
// ============================================================================

export interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiError extends Error {
  code: string;
  status?: number;
  details?: unknown;
}

export class ApiClientError extends Error implements ApiError {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

// ============================================================================
// Tauri Invoke Wrapper
// ============================================================================

/**
 * Safe wrapper for Tauri invoke calls with error handling
 */
export async function tauriInvoke<T>(
  command: string,
  args?: Record<string, unknown>
): Promise<T> {
  try {
    return await invoke<T>(command, args);
  } catch (error) {
    throw new ApiClientError(
      `Failed to execute command: ${command}`,
      "INVOKE_ERROR",
      undefined,
      error
    );
  }
}

// ============================================================================
// HTTP Client (for future REST API integration)
// ============================================================================

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

/**
 * Create an API client instance
 * Currently a placeholder - implement when backend API is ready
 */
export function createApiClient(config: ApiClientConfig = {}) {
  const { baseUrl = "", timeout = 30000, headers = {} } = config;

  async function request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { method = "GET", body } = options;

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiClientError(
          `HTTP Error: ${response.statusText}`,
          "HTTP_ERROR",
          response.status
        );
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiClientError("Request timeout", "TIMEOUT_ERROR");
      }

      throw new ApiClientError(
        "Network error",
        "NETWORK_ERROR",
        undefined,
        error
      );
    }
  }

  return {
    get: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
      request<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
      request<T>(endpoint, { ...options, method: "POST", body }),

    put: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
      request<T>(endpoint, { ...options, method: "PUT", body }),

    patch: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
      request<T>(endpoint, { ...options, method: "PATCH", body }),

    delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
      request<T>(endpoint, { ...options, method: "DELETE" }),
  };
}

// Default API client instance (configure with env variables when available)
export const apiClient = createApiClient();
