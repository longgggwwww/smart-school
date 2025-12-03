import { useTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

const languages = [
  { key: "en", label: "🇺🇸 English" },
  { key: "vi", label: "🇻🇳 Tiếng Việt" },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLang = languages.find((l) => l.key === i18n.language) || languages[0];

  const handleLanguageChange = (key: string) => {
    i18n.changeLanguage(key);
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
        {languages.map((lang) => (
          <DropdownItem key={lang.key}>{lang.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
