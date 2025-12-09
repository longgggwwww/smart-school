/**
 * Navigation Menu Component
 * Role-based navigation menu for MainLayout
 */
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { ChevronDownIcon } from "../icons";
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
  );
}

export default NavMenu;
