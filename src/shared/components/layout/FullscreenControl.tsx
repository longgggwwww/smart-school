/**
 * Fullscreen Control Component
 * Button to toggle fullscreen mode
 */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button, Tooltip, Divider } from "@heroui/react";

// Fullscreen icons
const FullscreenIcon = () => (
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
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
    />
  </svg>
);

const ExitFullscreenIcon = () => (
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
      d="M9 9V4H4m0 0l5 5m6-5h5v5m0-5l-5 5M9 15v5H4m0 0l5-5m6 5h5v-5m0 5l-5-5"
    />
  </svg>
);

interface FullscreenControlProps {
  showDivider?: boolean;
}

export function FullscreenControl({ showDivider = true }: FullscreenControlProps) {
  const { t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Listen for fullscreen state changes
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      const currentWindow = getCurrentWindow();
      const fullscreen = await currentWindow.isFullscreen();
      setIsFullscreen(fullscreen);

      unlisten = await currentWindow.onResized(async () => {
        const fullscreen = await currentWindow.isFullscreen();
        setIsFullscreen(fullscreen);
      });
    };

    setupListener();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const handleFullscreen = async () => {
    const currentWindow = getCurrentWindow();
    if (isFullscreen) {
      await currentWindow.setFullscreen(false);
    } else {
      // Unmaximize first before going fullscreen to avoid Windows taskbar bug
      const maximized = await currentWindow.isMaximized();
      if (maximized) {
        await currentWindow.unmaximize();
      }
      await currentWindow.setFullscreen(true);
    }
  };

  return (
    <div className="flex items-center">
      <Tooltip
        content={
          isFullscreen ? t("common.exitFullscreen") : t("common.fullscreen")
        }
        placement="bottom"
      >
        <Button
          isIconOnly
          variant="light"
          radius="none"
          onPress={handleFullscreen}
          className="min-w-9 w-9 h-8 data-[hover=true]:bg-purple-500 data-[hover=true]:text-white"
        >
          {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
        </Button>
      </Tooltip>
      {showDivider && <Divider orientation="vertical" className="h-4 mx-1" />}
    </div>
  );
}

export default FullscreenControl;
