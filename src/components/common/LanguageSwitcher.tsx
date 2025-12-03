import { useTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { saveLanguageToConfig } from "../../i18n";
import { LANGUAGES } from "../../utils/constants";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLang =
    LANGUAGES.find((l) => l.key === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = async (key: string) => {
    await i18n.changeLanguage(key);
    // Save to config file for persistence across app restarts
    saveLanguageToConfig(key);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" size="sm">
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
