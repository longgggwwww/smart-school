/**
 * MenuBar Component (renamed from TitleBar)
 * Custom window menu bar with drag support and window controls
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button, Tooltip } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { LanguageSwitcher, ThemeSwitcher } from "../common";
import {
  MinusIcon,
  MaximizeIcon,
  RestoreIcon,
  CloseIcon,
  BackIcon,
} from "../icons";

export interface MenuBarProps {
  /** Show back button - defaults to auto (based on route depth) */
  showBack?: boolean | "auto";
  /** Custom back handler, defaults to router back */
  onBack?: () => void;
  /** Root routes where back button should NOT appear (for "auto" mode) */
  rootRoutes?: string[];
  /** Show theme switcher */
  showThemeSwitcher?: boolean;
  /** Show language switcher */
  showLanguageSwitcher?: boolean;
  /** Show minimize button */
  showMinimize?: boolean;
  /** Show maximize button */
  showMaximize?: boolean;
  /** Show close button */
  showClose?: boolean;
  /** Custom left content */
  leftContent?: React.ReactNode;
  /** Custom center content */
  centerContent?: React.ReactNode;
  /** Custom right content (before window controls) */
  rightContent?: React.ReactNode;
  /** Height class */
  height?: string;
}

export default function MenuBar({
  showBack = "auto",
  onBack,
  rootRoutes = ["/", "/dashboard"],
  showThemeSwitcher = true,
  showLanguageSwitcher = true,
  showMinimize = true,
  showMaximize = false,
  showClose = true,
  leftContent,
  centerContent,
  rightContent,
  height = "h-8",
}: MenuBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Listen for window maximize/unmaximize and fullscreen events
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      const currentWindow = getCurrentWindow();
      // Check initial state
      const maximized = await currentWindow.isMaximized();
      const fullscreen = await currentWindow.isFullscreen();
      setIsMaximized(maximized);
      setIsFullscreen(fullscreen);

      // Listen for changes
      unlisten = await currentWindow.onResized(async () => {
        const maximized = await currentWindow.isMaximized();
        const fullscreen = await currentWindow.isFullscreen();
        setIsMaximized(maximized);
        setIsFullscreen(fullscreen);
      });
    };

    setupListener();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  // Determine if back button should be visible (iPhone Settings style)
  const shouldShowBack = (): boolean => {
    if (showBack === false) return false;
    if (showBack === true) return true;

    // Auto mode: show only when in deep level (not root routes)
    const isRootRoute = rootRoutes.includes(location.pathname);
    return !isRootRoute;
  };

  const canGoBack = shouldShowBack();

  const handleDrag = async (e: React.MouseEvent) => {
    // Only drag if clicking directly on the header or drag-enabled areas
    const target = e.target as HTMLElement;
    // Don't drag if clicking on buttons, inputs, or interactive elements
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("[data-no-drag]")
    ) {
      return;
    }
    const currentWindow = getCurrentWindow();
    await currentWindow.startDragging();
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleMinimize = async () => {
    const currentWindow = getCurrentWindow();
    await currentWindow.minimize();
  };

  const handleMaximize = async () => {
    const currentWindow = getCurrentWindow();
    if (isMaximized) {
      await currentWindow.unmaximize();
    } else {
      await currentWindow.maximize();
    }
  };

  const handleClose = async () => {
    const currentWindow = getCurrentWindow();
    await currentWindow.close();
  };

  return (
    <header
      className={`flex items-center justify-between ${height} cursor-move select-none`}
      onMouseDown={handleDrag}
    >
      {/* Left side - Back button, Theme/Language switchers */}
      <div className="flex items-center flex-1">
        <AnimatePresence mode="wait">
          {canGoBack && (
            <motion.div
              key="back-button"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <Tooltip content={t("common.back")} placement="bottom">
                <Button
                  isIconOnly
                  variant="light"
                  radius="none"
                  onPress={handleBack}
                  className="min-w-9 w-9 h-8"
                >
                  <BackIcon />
                </Button>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
        {showThemeSwitcher && <ThemeSwitcher titleBar />}
        {showLanguageSwitcher && <LanguageSwitcher />}
        {leftContent}
      </div>

      {/* Center - Custom center content */}
      {centerContent && (
        <div className="flex items-center justify-center">{centerContent}</div>
      )}

      {/* Right side - Custom content + Window controls */}
      <div className="flex items-center justify-end flex-1">
        {rightContent}
        {showMinimize && (
          <Tooltip content={t("common.minimize")} placement="bottom">
            <Button
              isIconOnly
              variant="light"
              radius="none"
              onPress={handleMinimize}
              className="min-w-9 w-9 h-8 data-[hover=true]:bg-yellow-500 data-[hover=true]:text-white"
            >
              <MinusIcon />
            </Button>
          </Tooltip>
        )}
        {showMaximize && (
          <Tooltip
            content={isMaximized ? t("common.restore") : t("common.maximize")}
            placement="bottom"
          >
            <Button
              isIconOnly
              variant="light"
              radius="none"
              isDisabled={isFullscreen}
              onPress={handleMaximize}
              className="min-w-9 w-9 h-8 data-[hover=true]:bg-blue-500 data-[hover=true]:text-white"
            >
              {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
            </Button>
          </Tooltip>
        )}
        {showClose && (
          <Tooltip content={t("common.close")} placement="bottom">
            <Button
              isIconOnly
              variant="light"
              radius="none"
              onPress={handleClose}
              className="min-w-9 w-9 h-8 data-[hover=true]:bg-red-500 data-[hover=true]:text-white"
            >
              <CloseIcon />
            </Button>
          </Tooltip>
        )}
      </div>
    </header>
  );
}

// Backwards-compat alias for a short deprecation period
export type TitleBarProps = MenuBarProps;
export const TitleBar = MenuBar;
