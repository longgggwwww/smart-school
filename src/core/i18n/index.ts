/**
 * Core i18n Configuration
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { DEFAULT_LANGUAGE } from "@src/core/config";

// Import locale files
import en from "./locales/en.json";
import vi from "./locales/vi.json";

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

/**
 * Load language from config file on app startup
 */
export async function loadLanguageFromConfig(): Promise<string> {
  try {
    const lang = await invoke<string | null>("get_app_language");
    if (lang && lang !== i18n.language) {
      await i18n.changeLanguage(lang);
    }
    return lang || DEFAULT_LANGUAGE;
  } catch {
    // Tauri invoke not available (dev mode or non-Tauri environment)
    return DEFAULT_LANGUAGE;
  }
}

/**
 * Save language to config file when changed
 */
export async function saveLanguageToConfig(language: string): Promise<void> {
  try {
    await invoke("set_app_language", { language });
  } catch (error) {
    console.error("Failed to save language to config:", error);
  }
}

/**
 * Change language and persist to config
 */
export async function changeLanguage(language: string): Promise<void> {
  await i18n.changeLanguage(language);
  await saveLanguageToConfig(language);
}

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

// Load language from config after i18n init
loadLanguageFromConfig();

export default i18n;
