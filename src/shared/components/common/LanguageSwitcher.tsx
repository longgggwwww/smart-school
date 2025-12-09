/**
 * Language Switcher Component
 * Dropdown to switch between supported languages
 */
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { LANGUAGES } from "../../../core/config";
import { changeLanguage } from "../../../core/i18n";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLang =
    LANGUAGES.find((l) => l.key === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = async (key: string) => {
    await changeLanguage(key);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" size="sm" radius="none">
          {currentLang.label}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("common.language")}
        selectionMode="single"
        selectedKeys={new Set([i18n.language])}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;
          if (selected) handleLanguageChange(selected);
        }}
      >
        {LANGUAGES.map((lang) => (
          <DropdownItem key={lang.key}>{lang.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
