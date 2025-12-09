/**
 * Navigation & Menu Types for Smart School
 * Based on role-based feature mindmaps
 */

import { UserRoleType } from "./auth";

// ============================================================================
// Menu Item Types
// ============================================================================

/**
 * Navigation menu item
 */
export interface MenuItem {
  key: string;
  labelKey: string; // i18n key
  path?: string; // Route path (if clickable)
  icon?: string; // Icon name or emoji
  permissions: string[]; // Required permissions (empty = all can access)
  roles?: UserRoleType[]; // Required roles (empty = all roles)
  children?: MenuItem[]; // Sub-menu items
  badge?: string | number; // Optional badge
  isNew?: boolean; // Show "new" indicator
}

/**
 * Route configuration
 */
export interface RouteConfig {
  path: string;
  labelKey: string;
  permissions: string[];
  roles?: UserRoleType[];
}

// ============================================================================
// Menu Configuration by Role
// ============================================================================

/**
 * Admin Portal Menu Items
 */
export const adminMenuItems: MenuItem[] = [
  {
    key: "dashboard",
    labelKey: "nav.dashboard",
    path: "/dashboard",
    icon: "📊",
    permissions: [],
    children: [
      {
        key: "overview",
        labelKey: "nav.admin.overview",
        path: "/dashboard/overview",
        permissions: [],
      },
      {
        key: "system-status",
        labelKey: "nav.admin.systemStatus",
        path: "/dashboard/system-status",
        permissions: [],
      },
    ],
  },
  {
    key: "users",
    labelKey: "nav.admin.users",
    icon: "👥",
    permissions: [],
    children: [
      {
        key: "accounts",
        labelKey: "nav.admin.accounts",
        path: "/users/accounts",
        permissions: [],
      },
      {
        key: "rbac",
        labelKey: "nav.admin.rbac",
        path: "/users/rbac",
        permissions: [],
      },
      {
        key: "teachers",
        labelKey: "nav.admin.teachers",
        path: "/users/teachers",
        permissions: [],
      },
      {
        key: "students",
        labelKey: "nav.admin.students",
        path: "/users/students",
        permissions: [],
      },
    ],
  },
  {
    key: "classes",
    labelKey: "nav.admin.classes",
    icon: "🏫",
    permissions: [],
    children: [
      {
        key: "create-class",
        labelKey: "nav.admin.createClass",
        path: "/classes/create",
        permissions: [],
      },
      {
        key: "schedule",
        labelKey: "nav.admin.schedule",
        path: "/classes/schedule",
        permissions: [],
      },
      {
        key: "assignments",
        labelKey: "nav.admin.assignments",
        path: "/classes/assignments",
        permissions: [],
      },
    ],
  },
  {
    key: "infrastructure",
    labelKey: "nav.admin.infrastructure",
    icon: "🖥️",
    permissions: [],
    children: [
      {
        key: "rooms-devices",
        labelKey: "nav.admin.roomsDevices",
        path: "/infrastructure/rooms",
        permissions: [],
      },
      {
        key: "monitoring",
        labelKey: "nav.admin.monitoring",
        path: "/infrastructure/monitoring",
        permissions: [],
      },
      {
        key: "config",
        labelKey: "nav.admin.config",
        path: "/infrastructure/config",
        permissions: [],
      },
    ],
  },
  {
    key: "reports",
    labelKey: "nav.admin.reports",
    icon: "📈",
    permissions: [],
    children: [
      {
        key: "teaching-reports",
        labelKey: "nav.admin.teachingReports",
        path: "/reports/teaching",
        permissions: [],
      },
      {
        key: "audit-logs",
        labelKey: "nav.admin.auditLogs",
        path: "/reports/audit-logs",
        permissions: [],
      },
      {
        key: "backup",
        labelKey: "nav.admin.backup",
        path: "/reports/backup",
        permissions: [],
      },
    ],
  },
];

/**
 * Teacher Menu Items
 */
export const teacherMenuItems: MenuItem[] = [
  {
    key: "live-class",
    labelKey: "nav.teacher.liveClass",
    icon: "🎥",
    permissions: [],
    children: [
      {
        key: "class-control",
        labelKey: "nav.teacher.classControl",
        path: "/live-class/control",
        permissions: [],
      },
      {
        key: "teaching",
        labelKey: "nav.teacher.teaching",
        path: "/live-class/teaching",
        permissions: [],
      },
      {
        key: "interaction",
        labelKey: "nav.teacher.interaction",
        path: "/live-class/interaction",
        permissions: [],
      },
    ],
  },
  {
    key: "learning-management",
    labelKey: "nav.teacher.learningManagement",
    icon: "📚",
    permissions: [],
    children: [
      {
        key: "my-classes",
        labelKey: "nav.teacher.myClasses",
        path: "/learning/classes",
        permissions: [],
      },
      {
        key: "content",
        labelKey: "nav.teacher.content",
        path: "/learning/content",
        permissions: [],
      },
      {
        key: "gradebook",
        labelKey: "nav.teacher.gradebook",
        path: "/learning/grades",
        permissions: [],
      },
    ],
  },
  {
    key: "settings",
    labelKey: "nav.settings",
    icon: "⚙️",
    permissions: [],
    children: [
      {
        key: "personal-schedule",
        labelKey: "nav.teacher.personalSchedule",
        path: "/settings/schedule",
        permissions: [],
      },
      {
        key: "notifications",
        labelKey: "nav.teacher.notifications",
        path: "/settings/notifications",
        permissions: [],
      },
    ],
  },
];

/**
 * Student Menu Items
 */
export const studentMenuItems: MenuItem[] = [
  {
    key: "live-class",
    labelKey: "nav.student.liveClass",
    icon: "🎥",
    permissions: [],
    children: [
      {
        key: "join-class",
        labelKey: "nav.student.joinClass",
        path: "/live-class/join",
        permissions: [],
      },
      {
        key: "chat",
        labelKey: "nav.student.chat",
        path: "/live-class/chat",
        permissions: [],
      },
    ],
  },
  {
    key: "my-learning",
    labelKey: "nav.student.myLearning",
    icon: "📖",
    permissions: [],
    children: [
      {
        key: "my-classes",
        labelKey: "nav.student.myClasses",
        path: "/learning/my-classes",
        permissions: [],
      },
      {
        key: "assignments",
        labelKey: "nav.student.assignments",
        path: "/learning/assignments",
        permissions: [],
      },
      {
        key: "my-grades",
        labelKey: "nav.student.myGrades",
        path: "/learning/grades",
        permissions: [],
      },
    ],
  },
  {
    key: "settings",
    labelKey: "nav.settings",
    icon: "⚙️",
    permissions: [],
    children: [
      {
        key: "notifications",
        labelKey: "nav.student.notifications",
        path: "/settings/notifications",
        permissions: [],
      },
    ],
  },
];

/**
 * Get menu items by user role
 */
export function getMenuItemsByRole(roleType: UserRoleType): MenuItem[] {
  switch (roleType) {
    case UserRoleType.SUPER_ADMIN:
    case UserRoleType.ADMIN:
      return adminMenuItems;
    case UserRoleType.TEACHER:
      return teacherMenuItems;
    case UserRoleType.STUDENT:
      return studentMenuItems;
    default:
      return [];
  }
}

/**
 * Flatten menu items to get all routes
 */
export function flattenMenuItems(items: MenuItem[]): RouteConfig[] {
  const routes: RouteConfig[] = [];

  function traverse(menuItems: MenuItem[]) {
    for (const item of menuItems) {
      if (item.path) {
        routes.push({
          path: item.path,
          labelKey: item.labelKey,
          permissions: item.permissions,
          roles: item.roles,
        });
      }
      if (item.children) {
        traverse(item.children);
      }
    }
  }

  traverse(items);
  return routes;
}
