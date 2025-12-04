/**
 * RBAC Types for Smart School Authentication System
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * User role types in the system
 */
export enum UserRoleType {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

/**
 * User account status
 */
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  LOCKED = "LOCKED",
  PENDING = "PENDING",
}

/**
 * Permission actions
 */
export enum PermissionAction {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  MANAGE = "MANAGE",
  APPROVE = "APPROVE",
  EXPORT = "EXPORT",
  IMPORT = "IMPORT",
}

// ============================================================================
// Base Interfaces
// ============================================================================

/**
 * Base entity with audit fields
 */
export interface BaseEntity {
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

// ============================================================================
// User & Profile Interfaces
// ============================================================================

/**
 * User permission entry
 */
export interface UserPermission {
  permission_id: string;
  resource: string;
  action: PermissionAction;
  allowed: boolean;
  conditions?: Record<string, unknown>;
}

/**
 * Role interface
 */
export interface Role extends BaseEntity {
  role_id: string;
  role_name: string;
  role_code: string;
  description: string;
  is_system_role: boolean;
  is_default: boolean;
  priority: number;
}

/**
 * Permission interface
 */
export interface Permission extends BaseEntity {
  permission_id: string;
  resource_name: string;
  resource_type: "MODULE" | "FEATURE" | "DATA" | "API";
  action: PermissionAction;
  description: string;
  endpoint_pattern?: string;
  http_method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  is_custom: boolean;
}

/**
 * Core User interface (simplified for frontend)
 */
export interface User extends BaseEntity {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  phone_number?: string;
  avatar_url?: string;
  date_of_birth?: Date;
  gender?: "MALE" | "FEMALE" | "OTHER";
  address?: string;

  // Status fields
  status: UserStatus;
  last_login?: Date;
  is_locked: boolean;

  // Relationships
  roles: Role[];
  permissions: UserPermission[];
}

/**
 * Authenticated user (returned after login)
 */
export interface AuthUser {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role_type: UserRoleType;

  // Role-specific IDs
  student_id?: string;
  teacher_id?: string;
  admin_id?: string;

  // Additional context
  class_id?: string;
  department?: string;

  // Permissions
  permissions: UserPermission[];
  roles: string[];
}

/**
 * Saved account for quick login
 */
export interface SavedAccount {
  user_id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  role_type: UserRoleType;
  last_login?: Date;
}

// ============================================================================
// Authentication Interfaces
// ============================================================================

/**
 * Device information for login
 */
export interface DeviceInfo {
  device_type: "WEB" | "MOBILE" | "TABLET" | "DESKTOP";
  os?: string;
  browser?: string;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  username: string;
  password: string;
  remember_me?: boolean;
  device_id?: string;
  device_info?: DeviceInfo;
}

/**
 * Login response from API
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    token_type: "Bearer";
    expires_in: number;
    user: AuthUser;
    permissions: string[];
    roles: string[];
  };
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
  refresh_token: string;
  device_id?: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// ============================================================================
// API Response Interfaces
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: Date;
  request_id?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

// ============================================================================
// State Management Interfaces
// ============================================================================

/**
 * Authentication state for store/context
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: AuthUser | null;
  permissions: UserPermission[];
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

/**
 * Initial auth state
 */
export const INITIAL_AUTH_STATE: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: null,
  permissions: [],
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * useAuth hook return type
 */
export interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasPermission: (resource: string, action: PermissionAction) => boolean;
  hasRole: (roleName: string) => boolean;
  isStudent: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Auth error codes
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
  ACCOUNT_INACTIVE = "ACCOUNT_INACTIVE",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Auth error response
 */
export interface AuthErrorResponse {
  success: false;
  message: string;
  error_code: AuthErrorCode;
  details?: Record<string, unknown>;
}
