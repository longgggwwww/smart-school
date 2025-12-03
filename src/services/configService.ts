import { invoke } from "@tauri-apps/api/core";

// ============================================================================
// Types (matching Rust backend)
// ============================================================================

export type ScreenMode = "normal" | "maximized" | "fullscreen";

export interface WindowConfig {
  width: number;
  height: number;
  x: number | null;
  y: number | null;
  screen_mode: ScreenMode;
}

export interface StartupConfig {
  auto_start: boolean;
}

export interface AppConfig {
  language: string;
  theme: "dark" | "light" | "system";
  window: WindowConfig;
  startup: StartupConfig;
}

// ============================================================================
// Config Service Functions
// ============================================================================

/**
 * Get the full app configuration from YAML config file
 */
export async function getConfig(): Promise<AppConfig> {
  try {
    return await invoke<AppConfig>("get_config");
  } catch (error) {
    console.error("Failed to get config:", error);
    // Return default config on error
    return {
      language: "en",
      theme: "system",
      window: {
        width: 800,
        height: 600,
        x: null,
        y: null,
        screen_mode: "normal",
      },
      startup: {
        auto_start: false,
      },
    };
  }
}

/**
 * Update the full app configuration
 */
export async function setConfig(config: AppConfig): Promise<void> {
  try {
    await invoke("set_config", { config });
  } catch (error) {
    console.error("Failed to set config:", error);
    throw error;
  }
}

// ============================================================================
// Language Functions
// ============================================================================

/**
 * Get the app language from config
 */
export async function getLanguage(): Promise<string> {
  try {
    const lang = await invoke<string | null>("get_app_language");
    return lang || "en";
  } catch (error) {
    console.error("Failed to get language:", error);
    return "en";
  }
}

/**
 * Set the app language in config
 */
export async function setLanguage(language: string): Promise<void> {
  try {
    await invoke("set_app_language", { language });
  } catch (error) {
    console.error("Failed to set language:", error);
    throw error;
  }
}

// ============================================================================
// Theme Functions
// ============================================================================

export type Theme = "dark" | "light" | "system";

/**
 * Get the app theme from config
 */
export async function getTheme(): Promise<Theme> {
  try {
    const theme = await invoke<string>("get_app_theme");
    return theme as Theme;
  } catch (error) {
    console.error("Failed to get theme:", error);
    return "system";
  }
}

/**
 * Set the app theme in config
 */
export async function setTheme(theme: Theme): Promise<void> {
  try {
    await invoke("set_app_theme", { theme });
  } catch (error) {
    console.error("Failed to set theme:", error);
    throw error;
  }
}

// ============================================================================
// Window State Functions
// ============================================================================

/**
 * Get the saved window state from config
 */
export async function getWindowState(): Promise<WindowConfig> {
  try {
    return await invoke<WindowConfig>("get_window_state");
  } catch (error) {
    console.error("Failed to get window state:", error);
    return {
      width: 800,
      height: 600,
      x: null,
      y: null,
      screen_mode: "normal",
    };
  }
}

/**
 * Save the current window state to config
 */
export async function saveWindowState(state: WindowConfig): Promise<void> {
  try {
    await invoke("save_window_state", {
      width: state.width,
      height: state.height,
      x: state.x,
      y: state.y,
      screenMode: state.screen_mode,
    });
  } catch (error) {
    console.error("Failed to save window state:", error);
    throw error;
  }
}

// ============================================================================
// Auto-Start Functions
// ============================================================================

/**
 * Get the auto-start setting from config
 */
export async function getAutoStart(): Promise<boolean> {
  try {
    return await invoke<boolean>("get_auto_start");
  } catch (error) {
    console.error("Failed to get auto-start setting:", error);
    return false;
  }
}

/**
 * Set the auto-start setting in config
 * This also enables/disables the actual system auto-start
 */
export async function setAutoStart(enabled: boolean): Promise<void> {
  try {
    // Save to config
    await invoke("set_auto_start", { enabled });
    
    // Also enable/disable the actual system auto-start via plugin
    if (enabled) {
      await invoke("plugin:autostart|enable");
    } else {
      await invoke("plugin:autostart|disable");
    }
  } catch (error) {
    console.error("Failed to set auto-start:", error);
    throw error;
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
