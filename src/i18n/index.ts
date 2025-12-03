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

// Custom detector to read language from Windows Registry (set by WiX installer)
const installerLanguageDetector = {
  name: "installerLanguage",
  
  // Synchronous lookup - returns cached value from localStorage
  lookup(): string | undefined {
    // Check if we already detected installer language before
    const cached = localStorage.getItem("installerLanguageDetected");
    if (cached) {
      return cached;
    }
    return undefined;
  },
  
  cacheUserLanguage: (lng: string) => {
    localStorage.setItem("i18nextLng", lng);
  },
};

// Detect installer language on app startup and cache it
async function detectInstallerLanguage() {
  try {
    const lang = await invoke<string | null>("get_installer_language");
    if (lang) {
      localStorage.setItem("installerLanguageDetected", lang);
      // Change language if different from current
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  } catch {
    // Tauri invoke not available (dev mode or non-Windows)
  }
}

// Create a custom language detector with installer language as highest priority
const customLanguageDetector = new LanguageDetector();
customLanguageDetector.addDetector(installerLanguageDetector);

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
      // Priority: installer language > localStorage > browser navigator
      order: ["installerLanguage", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Detect installer language after i18n init
detectInstallerLanguage();

export default i18n;
