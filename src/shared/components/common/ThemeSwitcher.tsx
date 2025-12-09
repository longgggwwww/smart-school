/**
 * Theme Switcher Component
 * Toggle between light and dark themes
 */
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "@heroui/react";
import { useTheme } from "../../../core/config";
import { SunIcon, MoonIcon } from "../icons";

interface ThemeSwitcherProps {
  /** Use compact title bar style */
  titleBar?: boolean;
}

export default function ThemeSwitcher({
  titleBar = false,
}: ThemeSwitcherProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  // Determine if currently dark mode
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (titleBar) {
    return (
      <Tooltip
        content={isDark ? t("common.lightMode") : t("common.darkMode")}
        placement="bottom"
      >
        <Button
          isIconOnly
          variant="light"
          radius="none"
          onPress={toggleTheme}
          className="min-w-9 w-9 h-8"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      content={isDark ? t("common.lightMode") : t("common.darkMode")}
      placement="bottom"
    >
      <Button isIconOnly variant="light" size="sm" onPress={toggleTheme}>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </Button>
    </Tooltip>
  );
}
