import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { invoke } from "@tauri-apps/api/core";

import en from "./locales/en.json";
import vi from "./locales/vi.json";

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

// Custom detector to read language from Windows Registry
const registryLanguageDetector = {
  name: "registryLanguage",
  
  // Synchronous lookup - returns cached value from localStorage
  lookup(): string | undefined {
    // Check if we already detected registry language before
    const cached = localStorage.getItem("registryLanguageDetected");
    if (cached) {
      return cached;
    }
    return undefined;
  },
  
  cacheUserLanguage: (lng: string) => {
    localStorage.setItem("i18nextLng", lng);
  },
};

// Detect language from registry on app startup and cache it
async function detectRegistryLanguage() {
  try {
    const lang = await invoke<string | null>("get_app_language");
    if (lang) {
      localStorage.setItem("registryLanguageDetected", lang);
      // Change language if different from current
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  } catch {
    // Tauri invoke not available (dev mode or non-Windows)
  }
}

// Save language to registry when changed
export async function saveLanguageToRegistry(language: string): Promise<void> {
  try {
    await invoke("set_app_language", { language });
    localStorage.setItem("registryLanguageDetected", language);
  } catch (error) {
    console.error("Failed to save language to registry:", error);
  }
}

// Create a custom language detector with registry language as highest priority
const customLanguageDetector = new LanguageDetector();
customLanguageDetector.addDetector(registryLanguageDetector);

i18n
  .use(customLanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Priority: registry language > localStorage > browser navigator
      order: ["registryLanguage", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Detect registry language after i18n init
detectRegistryLanguage();

export default i18n;
