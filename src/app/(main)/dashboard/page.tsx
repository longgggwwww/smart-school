import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { TitleBar } from "../../../components";
import { getStoredUser } from "../../../services";
import { AuthUser, UserRoleType } from "../../../types";
import { useWindowStateSync } from "../../../hooks";

// Fullscreen icon
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

export default function DashboardPage() {
  const { t } = useTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-sync window state to config file
  useWindowStateSync();

  // Load current user on mount
  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);
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

  // User info component for TitleBar - bold username with colored role chip
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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Custom Title Bar with maximize button and user info centered */}
      <TitleBar
        showMaximize={true}
        showThemeSwitcher={true}
        showLanguageSwitcher={true}
        centerContent={<UserInfo />}
        rightContent={<FullscreenControl />}
      />

      {/* Navigation Bar */}
      <Navbar isBordered className="bg-white dark:bg-gray-800">
        <NavbarBrand>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-2">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <p className="font-bold text-inherit">Smart School</p>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <span className="text-primary cursor-pointer">
              {t("dashboard.home")}
            </span>
          </NavbarItem>
          <NavbarItem>
            <span className="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-primary">
              {t("dashboard.students")}
            </span>
          </NavbarItem>
          <NavbarItem>
            <span className="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-primary">
              {t("dashboard.classes")}
            </span>
          </NavbarItem>
          <NavbarItem>
            <span className="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-primary">
              {t("dashboard.reports")}
            </span>
          </NavbarItem>
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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("dashboard.welcomeBack")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("dashboard.welcomeMessage")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={t("dashboard.totalStudents")}
            value="1,234"
            icon="👨‍🎓"
            color="blue"
          />
          <StatCard
            title={t("dashboard.totalClasses")}
            value="48"
            icon="📚"
            color="green"
          />
          <StatCard
            title={t("dashboard.totalTeachers")}
            value="86"
            icon="👩‍🏫"
            color="purple"
          />
          <StatCard
            title={t("dashboard.attendance")}
            value="94.5%"
            icon="✅"
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t("dashboard.quickActions")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="flat"
              color="primary"
              className="h-24 flex-col gap-2"
            >
              <span className="text-2xl">➕</span>
              <span>{t("dashboard.addStudent")}</span>
            </Button>
            <Button
              variant="flat"
              color="secondary"
              className="h-24 flex-col gap-2"
            >
              <span className="text-2xl">📝</span>
              <span>{t("dashboard.takeAttendance")}</span>
            </Button>
            <Button
              variant="flat"
              color="success"
              className="h-24 flex-col gap-2"
            >
              <span className="text-2xl">📊</span>
              <span>{t("dashboard.viewReports")}</span>
            </Button>
            <Button
              variant="flat"
              color="warning"
              className="h-24 flex-col gap-2"
            >
              <span className="text-2xl">⚙️</span>
              <span>{t("dashboard.settings")}</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: "blue" | "green" | "purple" | "orange";
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center`}
        >
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
