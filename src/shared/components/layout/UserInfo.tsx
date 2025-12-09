/**
 * User Info Component
 * Displays current user name and role chip
 */
import { Chip } from "@heroui/react";
import type { AuthUser, UserRoleType } from "../../../features/auth/types";

// Role color mapping for Chip
const roleChipColors: Record<
  UserRoleType,
  "primary" | "success" | "warning" | "danger"
> = {
  STUDENT: "primary",
  TEACHER: "success",
  ADMIN: "warning",
  SUPER_ADMIN: "danger",
};

// Role display names
const roleNames: Record<UserRoleType, string> = {
  STUDENT: "Student",
  TEACHER: "Teacher",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

interface UserInfoProps {
  user: AuthUser | null;
}

export function UserInfo({ user }: UserInfoProps) {
  if (!user) return null;

  const userName = user.full_name || user.username || "User";
  const roleType = user.role_type;
  const roleName = roleType ? roleNames[roleType] : "";
  const roleColor = roleType ? roleChipColors[roleType] : "primary";

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="font-bold text-gray-800 dark:text-gray-200">
        {userName}:
      </span>
      {roleType && (
        <Chip size="sm" color={roleColor} variant="flat" className="h-5">
          {roleName}
        </Chip>
      )}
    </div>
  );
}

export default UserInfo;
