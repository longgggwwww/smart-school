/**
 * User Menu Component
 * User avatar dropdown with profile actions
 * Following HeroUI Navbar "With Avatar" pattern
 */
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import type { AuthUser } from "../../../features/auth/types";

interface UserMenuProps {
  user: AuthUser | null;
  isLoggingOut?: boolean;
  onLogout: () => void;
}

export function UserMenu({
  user,
  isLoggingOut = false,
  onLogout,
}: UserMenuProps) {
  const { t } = useTranslation();

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          name={user?.full_name || "User"}
          size="sm"
          src={user?.avatar_url || ""}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">{t("dashboard.signedInAs")}</p>
          <p className="font-semibold text-primary">
            {user?.email || user?.username || "user@example.com"}
          </p>
        </DropdownItem>
        <DropdownItem key="settings">{t("dashboard.settings")}</DropdownItem>
        <DropdownItem key="help">{t("dashboard.help")}</DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={onLogout}>
          {isLoggingOut ? t("dashboard.loggingOut") : t("dashboard.logout")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default UserMenu;
