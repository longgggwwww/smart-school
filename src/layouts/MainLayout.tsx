/**
 * Main Layout
 * Layout wrapper for main application pages (after login)
 * Following HeroUI Navbar "With Avatar" pattern
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@heroui/react";
import {
  TitleBar,
  AnimatedOutlet,
  UserMenu,
  UserInfo,
  FullscreenControl,
  Logo,
  StatusBar,
} from "../shared/components";
import { useWindowStateSync } from "../shared/hooks";
import { getStoredUser } from "../features/auth";
import { AuthUser } from "../features/auth/types";
import { getMenuItemsByRole, MenuItem } from "./navigation";

export default function MainLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Check if current path matches nav item
  const isActiveNavItem = (item: MenuItem): boolean => {
    if (item.path && location.pathname === item.path) return true;
    if (item.children) {
      return item.children.some((child) => isActiveNavItem(child));
    }
    return false;
  };

  const handleNavigate = (path?: string) => {
    if (path) {
      navigate(path);
      setIsMenuOpen(false);
    }
  };

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

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Custom Title Bar with maximize button and user info centered */}
      <TitleBar
        showMaximize={true}
        showThemeSwitcher={true}
        showLanguageSwitcher={true}
        centerContent={<UserInfo user={currentUser} />}
        rightContent={<FullscreenControl />}
      />

      {/* Navigation Bar - Following HeroUI "With Avatar" pattern */}
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        classNames={{
          wrapper: "max-w-full",
        }}
      >
        {/* Mobile menu toggle */}
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        {/* Mobile centered brand */}
        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>
            <Logo size="md" showText />
          </NavbarBrand>
        </NavbarContent>

        {/* Desktop: Brand on left */}
        <NavbarContent className="hidden sm:flex" justify="start">
          <NavbarBrand>
            <Logo size="md" showText />
          </NavbarBrand>
        </NavbarContent>

        {/* Desktop: Menu items centered */}
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item) => (
            <NavbarItem key={item.key} isActive={isActiveNavItem(item)}>
              <Link
                color={isActiveNavItem(item) ? "primary" : "foreground"}
                className="cursor-pointer flex items-center gap-1"
                onPress={() => handleNavigate(item.path)}
              >
                {item.icon}
                {t(item.labelKey)}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Right: User avatar dropdown */}
        <NavbarContent justify="end">
          <UserMenu
            user={currentUser}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
          />
        </NavbarContent>

        {/* Mobile menu */}
        <NavbarMenu>
          {menuItems.map((item) => (
            <NavbarMenuItem key={item.key}>
              <Link
                color={isActiveNavItem(item) ? "primary" : "foreground"}
                className="w-full cursor-pointer flex items-center gap-2"
                onPress={() => handleNavigate(item.path)}
                size="lg"
              >
                {item.icon}
                {t(item.labelKey)}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>

      {/* Main Content Area - Changes based on route */}
      <main className="flex-1 overflow-auto pb-6">
        <AnimatedOutlet />
      </main>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}
