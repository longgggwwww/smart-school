import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button, Tooltip } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { LanguageSwitcher, ThemeSwitcher } from "../common";

// Icons
const MinusIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5 10h10a1 1 0 110 2H5a1 1 0 110-2z" />
  </svg>
);

const MaximizeIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} />
  </svg>
);

const RestoreIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="6" y="6" width="12" height="12" rx="1" strokeWidth={2} />
    <path
      d="M8 6V5a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1h-1"
      strokeWidth={2}
    />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const BackIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

export interface TitleBarProps {
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

export default function TitleBar({
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
}: TitleBarProps) {
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
