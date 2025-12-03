/**
 * Screen mode for window display
 */
export type ScreenMode = "normal" | "maximized" | "fullscreen";

/**
 * Supported theme values
 */
export type Theme = "dark" | "light" | "system";

/**
 * Supported language codes
 */
export type Language = "en" | "vi";

/**
 * Window state configuration
 */
export interface WindowConfig {
  width: number;
  height: number;
  x: number | null;
  y: number | null;
  screen_mode: ScreenMode;
}

/**
 * Startup configuration
 */
export interface StartupConfig {
  auto_start: boolean;
}

/**
 * Main application configuration
 */
export interface AppConfig {
  language: Language;
  theme: Theme;
  window: WindowConfig;
  startup: StartupConfig;
}

/**
 * Default values for configuration
 */
export const DEFAULT_CONFIG: AppConfig = {
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

/**
 * Default window config
 */
export const DEFAULT_WINDOW_CONFIG: WindowConfig = DEFAULT_CONFIG.window;
