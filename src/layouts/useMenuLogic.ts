import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { getStoredUser } from "@src/features/auth";
import { AuthUser } from "@src/features/auth/types";
import { getMenuItemsByRole, MenuItem } from "./navigation";
import { useWindowStateSync } from "@src/shared/hooks";

export function useMenuLogic() {
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

  return {
    currentUser,
    menuItems,
    isMenuOpen,
    setIsMenuOpen,
    isLoggingOut,
    handleNavigate,
    handleLogout,
    isActiveNavItem,
    t,
    location,
  };
}
