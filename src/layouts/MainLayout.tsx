/**
 * Main Layout
 * Layout wrapper for main application pages (after login)
 * Uses extracted sub-components for cleaner code
 */
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Navbar, NavbarBrand } from "@heroui/react";
import {
  TitleBar,
  AnimatedOutlet,
  NavMenu,
  UserMenu,
  UserInfo,
  FullscreenControl,
} from "../shared/components";
import { useWindowStateSync } from "../shared/hooks";
import { getStoredUser } from "../features/auth";
import { AuthUser } from "../features/auth/types";
import { getMenuItemsByRole, MenuItem } from "./navigation";

export default function MainLayout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
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

      {/* Navigation Bar - Fixed across all main pages */}
      <Navbar isBordered className="bg-white dark:bg-gray-800">
        <NavbarBrand>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-2">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <p className="font-bold text-inherit">Smart School</p>
        </NavbarBrand>

        {/* Role-based navigation menu */}
        <NavMenu menuItems={menuItems} />

        {/* User profile dropdown */}
        <UserMenu
          user={currentUser}
          isLoggingOut={isLoggingOut}
          onLogout={handleLogout}
        />
      </Navbar>

      {/* Main Content Area - Changes based on route */}
      <main className="flex-1 overflow-auto">
        <AnimatedOutlet />
      </main>
    </div>
  );
}
