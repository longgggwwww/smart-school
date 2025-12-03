import { useState } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
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
} from "@heroui/react";
import { LanguageSwitcher } from "../components";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await invoke("logout_to_login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
          <NavbarItem>
            <LanguageSwitcher />
          </NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name="User"
                size="sm"
                src=""
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">{t("dashboard.signedInAs")}</p>
                <p className="font-semibold text-primary">user@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings">{t("dashboard.settings")}</DropdownItem>
              <DropdownItem key="help">{t("dashboard.help")}</DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={handleLogout}
              >
                {isLoggingOut ? t("dashboard.loggingOut") : t("dashboard.logout")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
