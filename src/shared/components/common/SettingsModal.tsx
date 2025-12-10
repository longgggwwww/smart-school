/**
 * Settings Modal Component
 * Application settings dialog with tabs for different setting categories
 * Settings are persisted to YAML config file via Tauri
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Switch,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Divider,
} from "@src/shared/components/ui";
import {
  getTheme,
  setTheme,
  getLanguage,
  setLanguage,
  getAutoStart,
  setAutoStart,
  getRememberMeDefault,
  setRememberMeDefault,
  getNfcEnabled,
  setNfcEnabled,
  type Theme,
} from "@src/core/config";
import i18n from "@src/core/i18n";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Available themes
const themes: { value: Theme; labelKey: string }[] = [
  { value: "system", labelKey: "settings.theme.system" },
  { value: "light", labelKey: "settings.theme.light" },
  { value: "dark", labelKey: "settings.theme.dark" },
];

// Available languages
const languages = [
  { value: "en", label: "English" },
  { value: "vi", label: "Tiếng Việt" },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Settings state
  const [theme, setThemeState] = useState<Theme>("system");
  const [language, setLanguageState] = useState("en");
  const [autoStart, setAutoStartState] = useState(false);
  const [rememberMe, setRememberMeState] = useState(false);
  const [nfcEnabled, setNfcEnabledState] = useState(false);

  // Load current settings on open
  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const [themeVal, langVal, autoStartVal, rememberMeVal, nfcVal] =
        await Promise.all([
          getTheme(),
          getLanguage(),
          getAutoStart(),
          getRememberMeDefault(),
          getNfcEnabled(),
        ]);

      setThemeState(themeVal);
      setLanguageState(langVal);
      setAutoStartState(autoStartVal);
      setRememberMeState(rememberMeVal);
      setNfcEnabledState(nfcVal);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save all settings
      await Promise.all([
        setTheme(theme),
        setLanguage(language),
        setAutoStart(autoStart),
        setRememberMeDefault(rememberMe),
        setNfcEnabled(nfcEnabled),
      ]);

      // Apply language change immediately
      if (language !== i18n.language) {
        await i18n.changeLanguage(language);
      }

      // Apply theme change
      applyTheme(theme);

      onClose();
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.toggle("dark", prefersDark);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {t("settings.title")}
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-gray-500">{t("common.loading")}</span>
            </div>
          ) : (
            <Tabs aria-label="Settings tabs" variant="underlined">
              {/* General Tab */}
              <Tab key="general" title={t("settings.general")}>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{t("settings.autoStart")}</p>
                      <p className="text-sm text-gray-500">
                        {t("settings.autoStartDesc")}
                      </p>
                    </div>
                    <Switch
                      isSelected={autoStart}
                      onValueChange={setAutoStartState}
                    />
                  </div>

                  <Divider />

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{t("settings.rememberMe")}</p>
                      <p className="text-sm text-gray-500">
                        {t("settings.rememberMeDesc")}
                      </p>
                    </div>
                    <Switch
                      isSelected={rememberMe}
                      onValueChange={setRememberMeState}
                    />
                  </div>

                  <Divider />

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{t("settings.nfcLogin")}</p>
                      <p className="text-sm text-gray-500">
                        {t("settings.nfcLoginDesc")}
                      </p>
                    </div>
                    <Switch
                      isSelected={nfcEnabled}
                      onValueChange={setNfcEnabledState}
                    />
                  </div>
                </div>
              </Tab>

              {/* Appearance Tab */}
              <Tab key="appearance" title={t("settings.appearance")}>
                <div className="flex flex-col gap-4 py-4">
                  <div>
                    <p className="font-medium mb-2">
                      {t("settings.theme.label")}
                    </p>
                    <Select
                      selectedKeys={[theme]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as Theme;
                        if (selected) setThemeState(selected);
                      }}
                      aria-label={t("settings.theme.label")}
                    >
                      {themes.map((themeOption) => (
                        <SelectItem key={themeOption.value}>
                          {t(themeOption.labelKey)}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </Tab>

              {/* Language Tab */}
              <Tab key="language" title={t("settings.language")}>
                <div className="flex flex-col gap-4 py-4">
                  <div>
                    <p className="font-medium mb-2">
                      {t("settings.selectLanguage")}
                    </p>
                    <Select
                      selectedKeys={[language]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        if (selected) setLanguageState(selected);
                      }}
                      aria-label={t("settings.selectLanguage")}
                    >
                      {languages.map((lang) => (
                        <SelectItem key={lang.value}>{lang.label}</SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </Tab>
            </Tabs>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            isLoading={isSaving}
            isDisabled={isLoading}
          >
            {t("common.save")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SettingsModal;
