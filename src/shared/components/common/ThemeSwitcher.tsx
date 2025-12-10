/**
 * Theme Switcher Component
 * Toggle between light and dark themes
 */
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "@heroui/react";
import { useTheme } from "../../../core/config";
import { SunIcon, MoonIcon } from "../icons";

export default function ThemeSwitcher() {
  const { t } = useTranslation();
  const { setTheme, isDark } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [setTheme, isDark]);

  return (
    <Tooltip
      content={t(isDark ? "common.lightMode" : "common.darkMode")}
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
