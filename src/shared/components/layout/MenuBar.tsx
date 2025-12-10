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
  /** Custom left content */
  leftContent?: React.ReactNode[];
  /** Custom center content */
  centerContent?: React.ReactNode[];
  /** Custom right content (before window controls) */
  rightContent?: React.ReactNode[];
  /** Height class */
  height?: string;
}

export default function MenuBar({
  showBack = "auto",
  onBack,
  rootRoutes = ["/", "/dashboard"],
  leftContent = [],
  centerContent = [],
  rightContent = [],
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

    // Auto mode: show only when in deep level (not root routes) and onBack is provided
    const isRootRoute = rootRoutes.includes(location.pathname);
    return !isRootRoute && !!onBack;
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
    <div
      onMouseDown={handleDrag}
      className={`${height} flex items-center justify-between cursor-move select-none bg-transparent`}
    >
      {/* Left side - Back button + Custom left content */}
      <div className="flex items-center gap-0">
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
        {leftContent.map((content, index) => (
          <div key={index}>{content}</div>
        ))}
      </div>

      {/* Center - Custom center content */}
      {centerContent.length > 0 && (
        <div className="hidden sm:flex items-center justify-center gap-4 flex-1">
          {centerContent.map((content, index) => (
            <div key={index}>{content}</div>
          ))}
        </div>
      )}

      {/* Right side - Custom content + Window controls */}
      <div className="flex items-center justify-end gap-0">
        {rightContent.map((content, index) => (
          <div key={index}>{content}</div>
        ))}
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
      </div>
    </div>
  );
}

// Backwards-compat alias for a short deprecation period
// export type TitleBarProps = MenuBarProps;
// export const TitleBar = MenuBar;
