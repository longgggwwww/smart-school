/**
 * StatusBar Component
 * VSCode-style status bar at the bottom of the application
 * Shows connection status and settings access
 */
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import {
  Chip,
  Tooltip,
  Button,
  useDisclosure,
} from "@src/shared/components/ui";
import { SettingsIcon } from "../icons";
import { SettingsModal } from "../common";

// Connection check interval (ms)
const CONNECTION_CHECK_INTERVAL = 30000;

export function StatusBar() {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Check connection status
  const checkConnection = useCallback(async () => {
    try {
      const result = await invoke<boolean>("check_connection");
      setIsConnected(result);
    } catch {
      setIsConnected(false);
    }
  }, []);

  // Check connection on mount and periodically
  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, CONNECTION_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkConnection]);

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 h-6 bg-primary-600 dark:bg-default-100 border-t border-primary-700 dark:border-default-200 flex items-center justify-between px-3 z-50">
        {/* Left side - Connection status */}
        <Chip
          size="sm"
          variant="dot"
          color={isConnected ? "success" : "danger"}
          classNames={{
            base: "bg-transparent border-none px-0",
            content: "text-white dark:text-default-600 text-xs",
            dot: isConnected ? "bg-success" : "bg-danger",
          }}
        >
          {isConnected ? t("statusBar.connected") : t("statusBar.disconnected")}
        </Chip>

        {/* Right side - Settings */}
        <Tooltip content={t("statusBar.settings")} placement="top">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={onOpen}
            aria-label={t("statusBar.settings")}
            className="min-w-6 w-6 h-5 text-white dark:text-default-600"
          >
            <SettingsIcon />
          </Button>
        </Tooltip>
      </footer>

      {/* Settings Modal */}
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default StatusBar;
