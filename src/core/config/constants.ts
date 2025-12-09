/**
 * Application-wide constants
 */

/**
 * Supported languages with their display labels
 */
export const LANGUAGES = [
  { key: "en", label: "🇺🇸 English", nativeName: "English" },
  { key: "vi", label: "🇻🇳 Tiếng Việt", nativeName: "Tiếng Việt" },
] as const;

/**
 * Default language code
 */
export const DEFAULT_LANGUAGE = "en";

/**
 * Supported themes
 */
export const THEMES = ["dark", "light", "system"] as const;

/**
 * Default theme
 */
export const DEFAULT_THEME = "system";

/**
 * Screen modes for window
 */
export const SCREEN_MODES = ["normal", "maximized", "fullscreen"] as const;

/**
 * App metadata
 */
export const APP_CONFIG = {
  name: "Smart School",
  version: "0.1.0",
} as const;
