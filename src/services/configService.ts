import { invoke } from "@tauri-apps/api/core";
import {
  AppConfig,
  WindowConfig,
  Theme,
  DEFAULT_CONFIG,
  DEFAULT_WINDOW_CONFIG,
} from "../types";

// Re-export types for convenience
export type { AppConfig, WindowConfig, Theme, ScreenMode, Language } from "../types";

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

/**
 * Wrapper for Tauri invoke calls with error handling
 */
async function safeInvoke<T>(
  command: string,
  args?: Record<string, unknown>
): Promise<T> {
  try {
    return await invoke<T>(command, args);
  } catch (error) {
    throw new ConfigError(`Failed to execute command: ${command}`, error);
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
    return await safeInvoke<AppConfig>("get_config");
  } catch (error) {
    console.error("Failed to get config:", error);
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Update the full app configuration
 */
export async function setConfig(config: AppConfig): Promise<void> {
  await safeInvoke("set_config", { config });
}

// ============================================================================
// Language Operations
// ============================================================================

/**
 * Get the app language from config
 */
export async function getLanguage(): Promise<string> {
  try {
    const lang = await safeInvoke<string | null>("get_app_language");
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
  await safeInvoke("set_app_language", { language });
}

// ============================================================================
// Theme Operations
// ============================================================================

/**
 * Get the app theme from config
 */
export async function getTheme(): Promise<Theme> {
  try {
    const theme = await safeInvoke<string>("get_app_theme");
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
  await safeInvoke("set_app_theme", { theme });
}

// ============================================================================
// Window State Operations
// ============================================================================

/**
 * Get the saved window state from config
 */
export async function getWindowState(): Promise<WindowConfig> {
  try {
    return await safeInvoke<WindowConfig>("get_window_state");
  } catch (error) {
    console.error("Failed to get window state:", error);
    return { ...DEFAULT_WINDOW_CONFIG };
  }
}

/**
 * Save the current window state to config
 */
export async function saveWindowState(state: WindowConfig): Promise<void> {
  await safeInvoke("save_window_state", {
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    screenMode: state.screen_mode,
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
    return await safeInvoke<boolean>("get_auto_start");
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
  await safeInvoke("set_auto_start", { enabled });

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
