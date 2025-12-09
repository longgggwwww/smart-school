/**
 * Navigation Menu Component
 * Role-based navigation menu for MainLayout
 * Following HeroUI Navbar "With Avatar" pattern
 * Returns items array and mobile menu - parent handles NavbarContent structure
 */
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "@heroui/react";
import type { MenuItem } from "../../../layouts/navigation";

interface NavMenuProps {
  menuItems: MenuItem[];
}

export function NavMenu({ menuItems }: NavMenuProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <>
      {menuItems.map((item) => (
        <Link
          key={item.key}
          color={isActiveNavItem(item) ? "primary" : "foreground"}
          className="cursor-pointer flex items-center gap-1"
          onPress={() => handleNavigate(item.path)}
        >
          {item.icon}
          {t(item.labelKey)}
        </Link>
      ))}
    </>
  );
}

export default NavMenu;
