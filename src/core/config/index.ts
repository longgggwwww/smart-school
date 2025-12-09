/**
 * Core Configuration Exports
 */

// Types
export * from "./types";

// Constants
export * from "./constants";

// Service functions
export {
  getConfig,
  setConfig,
  getLanguage,
  setLanguage,
  getTheme,
  setTheme,
  getWindowState,
  saveWindowState,
  getAutoStart,
  setAutoStart,
  isAutoStartEnabled,
  getRememberMeDefault,
  setRememberMeDefault,
  getNfcEnabled,
  setNfcEnabled,
  ConfigError,
} from "./service";

// Hooks
export {
  useAppConfig,
  useTheme,
  useWindowState,
  useAutoStart,
} from "./hooks";
