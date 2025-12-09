/**
 * Core Configuration Service
 * Handles app configuration via Tauri backend
 */
import { invoke } from "@tauri-apps/api/core";
import { tauriInvoke } from "../api";
import {
  AppConfig,
  WindowConfig,
  Theme,
  DEFAULT_CONFIG,
  DEFAULT_WINDOW_CONFIG,
} from "./types";

// Re-export types for convenience
export type {
  AppConfig,
  WindowConfig,
  Theme,
  ScreenMode,
  Language,
} from "./types";

/**
 * Custom error class for config-related errors
 */
export class ConfigError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ConfigError";
  }
}

// ============================================================================
// Full Config Operations
// ============================================================================

/**
 * Get the full app configuration from YAML config file
 */
export async function getConfig(): Promise<AppConfig> {
  try {
    return await tauriInvoke<AppConfig>("get_config");
  } catch (error) {
    console.error("Failed to get config:", error);
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Update the full app configuration
 */
export async function setConfig(config: AppConfig): Promise<void> {
  await tauriInvoke("set_config", { config });
}

// ============================================================================
// Language Operations
// ============================================================================

/**
 * Get the app language from config
 */
export async function getLanguage(): Promise<string> {
  try {
    const lang = await tauriInvoke<string | null>("get_app_language");
    return lang || DEFAULT_CONFIG.language;
  } catch (error) {
    console.error("Failed to get language:", error);
    return DEFAULT_CONFIG.language;
  }
}

/**
 * Set the app language in config
 */
export async function setLanguage(language: string): Promise<void> {
  await tauriInvoke("set_app_language", { language });
}

// ============================================================================
// Theme Operations
// ============================================================================

/**
 * Get the app theme from config
 */
export async function getTheme(): Promise<Theme> {
  try {
    const theme = await tauriInvoke<string>("get_app_theme");
    return theme as Theme;
  } catch (error) {
    console.error("Failed to get theme:", error);
    return DEFAULT_CONFIG.theme;
  }
}

/**
 * Set the app theme in config
 */
export async function setTheme(theme: Theme): Promise<void> {
  await tauriInvoke("set_app_theme", { theme });
}

// ============================================================================
// Window State Operations
// ============================================================================

/**
 * Get the saved window state from config
 */
export async function getWindowState(): Promise<WindowConfig> {
  try {
    return await tauriInvoke<WindowConfig>("get_window_state");
  } catch (error) {
    console.error("Failed to get window state:", error);
    return { ...DEFAULT_WINDOW_CONFIG };
  }
}

/**
 * Save the current window state to config
 */
export async function saveWindowState(state: WindowConfig): Promise<void> {
  await tauriInvoke("save_window_state", {
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    screen_mode: state.screen_mode,
  });
}

// ============================================================================
// Auto-Start Operations
// ============================================================================

/**
 * Get the auto-start setting from config
 */
export async function getAutoStart(): Promise<boolean> {
  try {
    return await tauriInvoke<boolean>("get_auto_start");
  } catch (error) {
    console.error("Failed to get auto-start setting:", error);
    return DEFAULT_CONFIG.startup.auto_start;
  }
}

/**
 * Set the auto-start setting in config and system
 */
export async function setAutoStart(enabled: boolean): Promise<void> {
  // Save to config
  await tauriInvoke("set_auto_start", { enabled });

  // Enable/disable actual system auto-start via plugin
  const pluginCommand = enabled
    ? "plugin:autostart|enable"
    : "plugin:autostart|disable";

  try {
    await invoke(pluginCommand);
  } catch (error) {
    console.error("Failed to toggle system auto-start:", error);
    // Don't throw - config is already saved
  }
}

/**
 * Check if system auto-start is actually enabled
 */
export async function isAutoStartEnabled(): Promise<boolean> {
  try {
    return await invoke<boolean>("plugin:autostart|is_enabled");
  } catch (error) {
    console.error("Failed to check auto-start status:", error);
    return false;
  }
}

// ============================================================================
// Auth Config Operations
// ============================================================================

/**
 * Get the remember me default setting from config
 */
export async function getRememberMeDefault(): Promise<boolean> {
  try {
    return await tauriInvoke<boolean>("get_remember_me_default");
  } catch (error) {
    console.error("Failed to get remember me default:", error);
    return DEFAULT_CONFIG.auth.remember_me_default;
  }
}

/**
 * Set the remember me default setting in config
 */
export async function setRememberMeDefault(enabled: boolean): Promise<void> {
  await tauriInvoke("set_remember_me_default", { enabled });
}

/**
 * Get the NFC enabled setting from config
 */
export async function getNfcEnabled(): Promise<boolean> {
  try {
    return await tauriInvoke<boolean>("get_nfc_enabled");
  } catch (error) {
    console.error("Failed to get NFC enabled setting:", error);
    return DEFAULT_CONFIG.auth.nfc_enabled;
  }
}

/**
 * Set the NFC enabled setting in config
 */
export async function setNfcEnabled(enabled: boolean): Promise<void> {
  await tauriInvoke("set_nfc_enabled", { enabled });
}
