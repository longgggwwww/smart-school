/**
 * Auth Feature - Mock Data
 * Mock users and data for development
 */
import {
  AuthUser,
  SavedAccount,
  UserRoleType,
  UserStatus,
  UserPermission,
  PermissionAction,
  Role,
  User,
} from "./types";

// ============================================================================
// Mock Roles
// ============================================================================

export const MOCK_ROLES: Role[] = [
  {
    role_id: "role_super_admin",
    role_name: "Super Admin",
    role_code: "SUPER_ADMIN",
    description: "Full system access",
    is_system_role: true,
    is_default: false,
    priority: 100,
  },
  {
    role_id: "role_admin",
    role_name: "Admin",
    role_code: "ADMIN",
    description: "School administration access",
    is_system_role: true,
    is_default: false,
    priority: 80,
  },
  {
    role_id: "role_teacher",
    role_name: "Teacher",
    role_code: "TEACHER",
    description: "Teacher access",
    is_system_role: true,
    is_default: false,
    priority: 50,
  },
  {
    role_id: "role_student",
    role_name: "Student",
    role_code: "STUDENT",
    description: "Student access",
    is_system_role: true,
    is_default: true,
    priority: 10,
  },
];

// ============================================================================
// Mock Permissions
// ============================================================================

/**
 * Generate permissions for a resource
 */
function createResourcePermissions(
  resource: string,
  actions: PermissionAction[],
  prefix: string = ""
): UserPermission[] {
  return actions.map((action) => ({
    permission_id: `perm_${prefix}${resource.toLowerCase()}_${action.toLowerCase()}`,
    resource,
    action,
    allowed: true,
  }));
}

// Super Admin permissions - full access
export const SUPER_ADMIN_PERMISSIONS: UserPermission[] = [
  ...createResourcePermissions("SYSTEM", Object.values(PermissionAction)),
  ...createResourcePermissions("USER", Object.values(PermissionAction)),
  ...createResourcePermissions("ROLE", Object.values(PermissionAction)),
  ...createResourcePermissions("SCHOOL", Object.values(PermissionAction)),
  ...createResourcePermissions("CLASS", Object.values(PermissionAction)),
  ...createResourcePermissions("STUDENT", Object.values(PermissionAction)),
  ...createResourcePermissions("TEACHER", Object.values(PermissionAction)),
  ...createResourcePermissions("COURSE", Object.values(PermissionAction)),
  ...createResourcePermissions("ATTENDANCE", Object.values(PermissionAction)),
  ...createResourcePermissions("GRADE", Object.values(PermissionAction)),
  ...createResourcePermissions("REPORT", Object.values(PermissionAction)),
];

// Admin permissions
export const ADMIN_PERMISSIONS: UserPermission[] = [
  ...createResourcePermissions("USER", [
    PermissionAction.CREATE,
    PermissionAction.READ,
    PermissionAction.UPDATE,
  ]),
  ...createResourcePermissions("CLASS", Object.values(PermissionAction)),
  ...createResourcePermissions("STUDENT", Object.values(PermissionAction)),
  ...createResourcePermissions("TEACHER", Object.values(PermissionAction)),
  ...createResourcePermissions("COURSE", Object.values(PermissionAction)),
  ...createResourcePermissions("ATTENDANCE", Object.values(PermissionAction)),
  ...createResourcePermissions("GRADE", [
    PermissionAction.READ,
    PermissionAction.EXPORT,
  ]),
  ...createResourcePermissions("REPORT", [
    PermissionAction.READ,
    PermissionAction.EXPORT,
  ]),
];

// Teacher permissions
export const TEACHER_PERMISSIONS: UserPermission[] = [
  ...createResourcePermissions("CLASS", [
    PermissionAction.READ,
    PermissionAction.UPDATE,
  ]),
  ...createResourcePermissions("STUDENT", [PermissionAction.READ]),
  ...createResourcePermissions("COURSE", [
    PermissionAction.READ,
    PermissionAction.UPDATE,
  ]),
  ...createResourcePermissions("ATTENDANCE", [
    PermissionAction.CREATE,
    PermissionAction.READ,
    PermissionAction.UPDATE,
  ]),
  ...createResourcePermissions("GRADE", [
    PermissionAction.CREATE,
    PermissionAction.READ,
    PermissionAction.UPDATE,
  ]),
  ...createResourcePermissions("REPORT", [PermissionAction.READ]),
];

// Student permissions
export const STUDENT_PERMISSIONS: UserPermission[] = [
  ...createResourcePermissions("CLASS", [PermissionAction.READ]),
  ...createResourcePermissions("COURSE", [PermissionAction.READ]),
  ...createResourcePermissions("ATTENDANCE", [PermissionAction.READ]),
  ...createResourcePermissions("GRADE", [PermissionAction.READ]),
  ...createResourcePermissions("REPORT", [PermissionAction.READ]),
];

// ============================================================================
// Mock Users
// ============================================================================

export const MOCK_USERS: User[] = [
  {
    user_id: "user_001",
    username: "superadmin",
    email: "superadmin@smartschool.edu.vn",
    full_name: "Super Administrator",
    phone_number: "0900000001",
    avatar_url: "/avatars/superadmin.png",
    status: UserStatus.ACTIVE,
    is_locked: false,
    last_login: new Date("2024-12-04T08:00:00Z"),
    roles: [MOCK_ROLES[0]],
    permissions: SUPER_ADMIN_PERMISSIONS,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-12-01"),
  },
  {
    user_id: "user_002",
    username: "admin",
    email: "admin@smartschool.edu.vn",
    full_name: "Quản trị viên",
    phone_number: "0900000002",
    avatar_url: "/avatars/admin.png",
    status: UserStatus.ACTIVE,
    is_locked: false,
    last_login: new Date("2024-12-04T07:30:00Z"),
    roles: [MOCK_ROLES[1]],
    permissions: ADMIN_PERMISSIONS,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-11-20"),
  },
  {
    user_id: "user_003",
    username: "teacher01",
    email: "nguyenvana@smartschool.edu.vn",
    full_name: "Nguyễn Văn A",
    phone_number: "0912345678",
    gender: "MALE",
    date_of_birth: new Date("1985-05-15"),
    status: UserStatus.ACTIVE,
    is_locked: false,
    last_login: new Date("2024-12-03T14:30:00Z"),
    roles: [MOCK_ROLES[2]],
    permissions: TEACHER_PERMISSIONS,
    created_at: new Date("2024-02-01"),
    updated_at: new Date("2024-11-20"),
  },
  {
    user_id: "user_004",
    username: "teacher02",
    email: "tranthib@smartschool.edu.vn",
    full_name: "Trần Thị B",
    phone_number: "0912345679",
    gender: "FEMALE",
    date_of_birth: new Date("1990-08-20"),
    status: UserStatus.ACTIVE,
    is_locked: false,
    last_login: new Date("2024-12-02T09:00:00Z"),
    roles: [MOCK_ROLES[2]],
    permissions: TEACHER_PERMISSIONS,
    created_at: new Date("2024-02-15"),
    updated_at: new Date("2024-10-15"),
  },
  {
    user_id: "user_005",
    username: "student01",
    email: "levand@student.smartschool.edu.vn",
    full_name: "Lê Văn D",
    gender: "MALE",
    date_of_birth: new Date("2010-03-10"),
    status: UserStatus.ACTIVE,
    is_locked: false,
    last_login: new Date("2024-12-04T07:45:00Z"),
    roles: [MOCK_ROLES[3]],
    permissions: STUDENT_PERMISSIONS,
    created_at: new Date("2024-09-01"),
    updated_at: new Date("2024-12-01"),
  },
  {
    user_id: "user_006",
    username: "student02",
    email: "phamthie@student.smartschool.edu.vn",
    full_name: "Phạm Thị E",
    gender: "FEMALE",
    date_of_birth: new Date("2010-07-25"),
    status: UserStatus.ACTIVE,
    is_locked: false,
    last_login: new Date("2024-12-03T16:20:00Z"),
    roles: [MOCK_ROLES[3]],
    permissions: STUDENT_PERMISSIONS,
    created_at: new Date("2024-09-01"),
    updated_at: new Date("2024-11-15"),
  },
  {
    user_id: "user_007",
    username: "locked_user",
    email: "locked@smartschool.edu.vn",
    full_name: "Tài khoản bị khóa",
    status: UserStatus.LOCKED,
    is_locked: true,
    roles: [MOCK_ROLES[3]],
    permissions: [],
    created_at: new Date("2024-06-01"),
    updated_at: new Date("2024-11-01"),
  },
  {
    user_id: "user_008",
    username: "inactive_user",
    email: "inactive@smartschool.edu.vn",
    full_name: "Tài khoản chưa kích hoạt",
    status: UserStatus.INACTIVE,
    is_locked: false,
    roles: [MOCK_ROLES[3]],
    permissions: [],
    created_at: new Date("2024-08-01"),
    updated_at: new Date("2024-08-01"),
  },
];

// ============================================================================
// Mock Auth Users (Simplified for login response)
// ============================================================================

export const MOCK_AUTH_USERS: AuthUser[] = [
  {
    user_id: "user_001",
    username: "superadmin",
    email: "superadmin@smartschool.edu.vn",
    full_name: "Super Administrator",
    avatar_url: "/avatars/superadmin.png",
    role_type: UserRoleType.SUPER_ADMIN,
    admin_id: "admin_001",
    permissions: SUPER_ADMIN_PERMISSIONS,
    roles: ["SUPER_ADMIN"],
  },
  {
    user_id: "user_002",
    username: "admin",
    email: "admin@smartschool.edu.vn",
    full_name: "Quản trị viên",
    avatar_url: "/avatars/admin.png",
    role_type: UserRoleType.ADMIN,
    admin_id: "admin_002",
    permissions: ADMIN_PERMISSIONS,
    roles: ["ADMIN"],
  },
  {
    user_id: "user_003",
    username: "teacher01",
    email: "nguyenvana@smartschool.edu.vn",
    full_name: "Nguyễn Văn A",
    role_type: UserRoleType.TEACHER,
    teacher_id: "teacher_001",
    department: "Toán học",
    permissions: TEACHER_PERMISSIONS,
    roles: ["TEACHER"],
  },
  {
    user_id: "user_004",
    username: "teacher02",
    email: "tranthib@smartschool.edu.vn",
    full_name: "Trần Thị B",
    role_type: UserRoleType.TEACHER,
    teacher_id: "teacher_002",
    department: "Văn học",
    permissions: TEACHER_PERMISSIONS,
    roles: ["TEACHER"],
  },
  {
    user_id: "user_005",
    username: "student01",
    email: "levand@student.smartschool.edu.vn",
    full_name: "Lê Văn D",
    role_type: UserRoleType.STUDENT,
    student_id: "student_001",
    class_id: "class_10A1",
    permissions: STUDENT_PERMISSIONS,
    roles: ["STUDENT"],
  },
  {
    user_id: "user_006",
    username: "student02",
    email: "phamthie@student.smartschool.edu.vn",
    full_name: "Phạm Thị E",
    role_type: UserRoleType.STUDENT,
    student_id: "student_002",
    class_id: "class_10A2",
    permissions: STUDENT_PERMISSIONS,
    roles: ["STUDENT"],
  },
];

// ============================================================================
// Mock Saved Accounts
// ============================================================================

export const MOCK_SAVED_ACCOUNTS: SavedAccount[] = [
  {
    user_id: "user_002",
    username: "admin",
    full_name: "Quản trị viên",
    avatar_url: "/avatars/admin.png",
    role_type: UserRoleType.ADMIN,
    last_login: new Date("2024-12-04T07:30:00Z"),
  },
  {
    user_id: "user_003",
    username: "teacher01",
    full_name: "Nguyễn Văn A",
    role_type: UserRoleType.TEACHER,
    last_login: new Date("2024-12-03T14:30:00Z"),
  },
  {
    user_id: "user_005",
    username: "student01",
    full_name: "Lê Văn D",
    role_type: UserRoleType.STUDENT,
    last_login: new Date("2024-12-04T07:45:00Z"),
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Find user by username
 */
export function findUserByUsername(username: string): User | undefined {
  return MOCK_USERS.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
}

/**
 * Find auth user by username
 */
export function findAuthUserByUsername(username: string): AuthUser | undefined {
  return MOCK_AUTH_USERS.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
}

/**
 * Get mock saved accounts
 */
export function getMockSavedAccounts(): SavedAccount[] {
  return [...MOCK_SAVED_ACCOUNTS];
}

/**
 * Validate mock password
 * In development: "password" works for all users, "wrong" always fails
 */
export function validateMockPassword(
  _username: string,
  password: string
): boolean {
  // For testing: "wrong" always fails
  if (password === "wrong") return false;
  // For testing: empty password fails
  if (!password || password.trim() === "") return false;
  // In dev mode, any other password works
  return true;
}

/**
 * Get permissions array as strings
 */
export function getPermissionStrings(permissions: UserPermission[]): string[] {
  return permissions
    .filter((p) => p.allowed)
    .map((p) => `${p.resource}:${p.action}`);
}
