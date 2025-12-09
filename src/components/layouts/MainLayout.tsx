import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Chip,
  Tooltip,
  Divider,
} from "@heroui/react";
import AnimatedOutlet from "../common/AnimatedOutlet";
import { TitleBar } from "../layout";
import { getStoredUser } from "../../services";
import {
  AuthUser,
  UserRoleType,
  MenuItem,
  getMenuItemsByRole,
} from "../../types";
import { useWindowStateSync } from "../../hooks";

// Fullscreen icons
const FullscreenIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
    />
  </svg>
);

const ExitFullscreenIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 9V4H4m0 0l5 5m6-5h5v5m0-5l-5 5M9 15v5H4m0 0l5-5m6 5h5v-5m0 5l-5-5"
    />
  </svg>
);

// Chevron Down Icon for dropdown menus
const ChevronDownIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

// Role color mapping for Chip
const roleChipColors: Record<
  UserRoleType,
  "primary" | "success" | "warning" | "danger"
> = {
  [UserRoleType.STUDENT]: "primary",
  [UserRoleType.TEACHER]: "success",
  [UserRoleType.ADMIN]: "warning",
  [UserRoleType.SUPER_ADMIN]: "danger",
};

// Role display names
const roleNames: Record<UserRoleType, string> = {
  [UserRoleType.STUDENT]: "Student",
  [UserRoleType.TEACHER]: "Teacher",
  [UserRoleType.ADMIN]: "Admin",
  [UserRoleType.SUPER_ADMIN]: "Super Admin",
};

export default function MainLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Auto-sync window state to config file
  useWindowStateSync();

  // Load current user on mount and set menu items based on role
  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);
    if (user?.role_type) {
      setMenuItems(getMenuItemsByRole(user.role_type));
    }
  }, []);

  // Listen for fullscreen state changes
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      const currentWindow = getCurrentWindow();
      const fullscreen = await currentWindow.isFullscreen();
      setIsFullscreen(fullscreen);

      unlisten = await currentWindow.onResized(async () => {
        const fullscreen = await currentWindow.isFullscreen();
        setIsFullscreen(fullscreen);
      });
    };

    setupListener();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await invoke("logout_to_auth");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleFullscreen = async () => {
    const currentWindow = getCurrentWindow();
    if (isFullscreen) {
      await currentWindow.setFullscreen(false);
    } else {
      // Unmaximize first before going fullscreen to avoid Windows taskbar bug
      const maximized = await currentWindow.isMaximized();
      if (maximized) {
        await currentWindow.unmaximize();
      }
      await currentWindow.setFullscreen(true);
    }
  };

  // Check if current path matches nav item or any of its children
  const isActiveNavItem = (item: MenuItem): boolean => {
    if (item.path && location.pathname === item.path) return true;
    if (item.children) {
      return item.children.some((child) => isActiveNavItem(child));
    }
    return false;
  };

  // Handle navigation
  const handleNavigate = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  // User info component for TitleBar
  const UserInfo = () => {
    const userName = currentUser?.full_name || currentUser?.username || "User";
    const roleType = currentUser?.role_type;
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
  };

  // Fullscreen button with divider for TitleBar right content
  const FullscreenControl = () => (
    <div className="flex items-center">
      <Tooltip
        content={
          isFullscreen ? t("common.exitFullscreen") : t("common.fullscreen")
        }
        placement="bottom"
      >
        <Button
          isIconOnly
          variant="light"
          radius="none"
          onPress={handleFullscreen}
          className="min-w-9 w-9 h-8 data-[hover=true]:bg-purple-500 data-[hover=true]:text-white"
        >
          {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
        </Button>
      </Tooltip>
      <Divider orientation="vertical" className="h-4 mx-1" />
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Custom Title Bar with maximize button and user info centered */}
      <TitleBar
        showMaximize={true}
        showThemeSwitcher={true}
        showLanguageSwitcher={true}
        centerContent={<UserInfo />}
        rightContent={<FullscreenControl />}
      />

      {/* Navigation Bar - Fixed across all main pages */}
      <Navbar isBordered className="bg-white dark:bg-gray-800">
        <NavbarBrand>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-2">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <p className="font-bold text-inherit">Smart School</p>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-1" justify="center">
          {menuItems.map((item) =>
            item.children && item.children.length > 0 ? (
              <Dropdown key={item.key}>
                <NavbarItem isActive={isActiveNavItem(item)}>
                  <DropdownTrigger>
                    <Button
                      variant="light"
                      className={`gap-1 ${
                        isActiveNavItem(item)
                          ? "text-primary"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                      endContent={<ChevronDownIcon />}
                    >
                      <span className="mr-1">{item.icon}</span>
                      {t(item.labelKey)}
                    </Button>
                  </DropdownTrigger>
                </NavbarItem>
                <DropdownMenu
                  aria-label={t(item.labelKey)}
                  onAction={(key) => {
                    const child = item.children?.find((c) => c.key === key);
                    handleNavigate(child?.path);
                  }}
                >
                  {item.children.map((child) => (
                    <DropdownItem
                      key={child.key}
                      className={
                        location.pathname === child.path ? "text-primary" : ""
                      }
                    >
                      {t(child.labelKey)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            ) : (
              <NavbarItem key={item.key} isActive={isActiveNavItem(item)}>
                <Button
                  variant="light"
                  className={
                    isActiveNavItem(item)
                      ? "text-primary"
                      : "text-gray-600 dark:text-gray-300"
                  }
                  onPress={() => handleNavigate(item.path)}
                >
                  <span className="mr-1">{item.icon}</span>
                  {t(item.labelKey)}
                </Button>
              </NavbarItem>
            )
          )}
        </NavbarContent>

        <NavbarContent justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={currentUser?.full_name || "User"}
                size="sm"
                src={currentUser?.avatar_url || ""}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">{t("dashboard.signedInAs")}</p>
                <p className="font-semibold text-primary">
                  {currentUser?.email ||
                    currentUser?.username ||
                    "user@example.com"}
                </p>
              </DropdownItem>
              <DropdownItem key="settings">
                {t("dashboard.settings")}
              </DropdownItem>
              <DropdownItem key="help">{t("dashboard.help")}</DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                {isLoggingOut
                  ? t("dashboard.loggingOut")
                  : t("dashboard.logout")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      {/* Main Content Area - Changes based on route */}
      <main className="flex-1 overflow-auto">
        <AnimatedOutlet />
      </main>
    </div>
  );
}
