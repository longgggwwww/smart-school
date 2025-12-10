/**
 * User Info Component
 * Displays current user name and role chip
 * No avatar - just name and role badge
 * Role names are hardcoded (mock data, not translated)
 */
import { Chip } from "@src/shared/components/ui";
import type { AuthUser, UserRoleType } from "@src/features/auth/types";

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

// Role display names (hardcoded - mock data)
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
    <div className="flex items-center gap-2">
      <span className="text-default-800 dark:text-default-200 font-semibold text-sm">
        {userName}
      </span>
      {roleType && (
        <Chip size="sm" color={roleColor} variant="flat">
          {roleName}
        </Chip>
      )}
    </div>
  );
}

export default UserInfo;
