import { useState } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  Button,
  Input,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
  Form,
  ButtonGroup,
} from "@heroui/react";
import { LanguageSwitcher, ThemeSwitcher } from "../components";

// Icons
const ChevronDownIcon = () => (
  <svg
    className="w-4 h-4 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const NfcIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
    />
  </svg>
);

const MinusIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5 10h10a1 1 0 110 2H5a1 1 0 110-2z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// Demo saved accounts - replace with actual saved accounts from storage
const savedAccounts = [
  { id: "admin", name: "Admin" },
  { id: "teacher01", name: "Nguyễn Văn A" },
  { id: "student01", name: "Trần Thị B" },
];

export default function LoginPage() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const id = formData.username as string;
    const pwd = formData.password as string;

    // Validate before loading
    if (!id || !pwd) {
      setError(t("auth.errorRequired"));
      return;
    }

    setIsLoading(true);

    try {

      // TODO: Add actual authentication logic here
      // For now, any ID/password combination works

      // Open main window and close login window
      await invoke("open_main_window");
    } catch (err) {
      setError(t("auth.errorLogin"));
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = async () => {
    const currentWindow = getCurrentWindow();
    await currentWindow.close();
  };

  const handleMinimize = async () => {
    const currentWindow = getCurrentWindow();
    await currentWindow.minimize();
  };

  const handleDrag = async () => {
    const currentWindow = getCurrentWindow();
    await currentWindow.startDragging();
  };

  return (
    <section className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Simple Title Bar - just minimize and close buttons */}
      <header
        className="flex items-center justify-between h-8 cursor-move select-none"
        onMouseDown={handleDrag}
      >
        <div className="flex items-center" onMouseDown={(e) => e.stopPropagation()}>
          <ThemeSwitcher titleBar />
          <LanguageSwitcher />
        </div>
        <div className="flex" onMouseDown={(e) => e.stopPropagation()}>
          <Tooltip content={t("common.minimize")} placement="bottom">
            <Button
              isIconOnly
              variant="light"
              radius="none"
              onPress={handleMinimize}
              className="min-w-9 w-9 h-8 data-[hover=true]:bg-yellow-500 data-[hover=true]:text-white"
            >
              <MinusIcon />
            </Button>
          </Tooltip>
          <Tooltip content={t("common.close")} placement="bottom">
            <Button
              isIconOnly
              variant="light"
              radius="none"
              onPress={handleClose}
              className="min-w-9 w-9 h-8 data-[hover=true]:bg-red-500 data-[hover=true]:text-white"
            >
              <CloseIcon />
            </Button>
          </Tooltip>
        </div>
      </header>

      {/* Login Content - full width */}
      <main className="flex-1 flex flex-col items-center pt-12 px-4">
        {/* Logo */}
        <Image src="/tauri.svg" alt="Logo" className="w-16 h-16 mb-3" />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          {t("auth.welcome")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {t("auth.signInToContinue")}
        </p>

        <Form
          onSubmit={handleLogin}
          className="flex flex-col gap-3 w-full max-w-sm"
        >
          <Input
            name="username"
            type="text"
            label={t("auth.username")}
            placeholder={t("auth.usernamePlaceholder")}
            value={username}
            onValueChange={(value) => {
              setUsername(value);
              if (error) setError("");
            }}
            isInvalid={submitted && !username}
            endContent={
              savedAccounts.length > 0 && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      variant="light"
                      className="min-w-6 w-6 h-6"
                    >
                      <ChevronDownIcon />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label={t("auth.selectAccount")}
                    onAction={(key) => setUsername(key as string)}
                  >
                    {savedAccounts.map((account) => (
                      <DropdownItem key={account.id}>
                        {account.name} ({account.id})
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              )
            }
          />

          <Input
            name="password"
            type="password"
            label={t("auth.password")}
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onValueChange={(value) => {
              setPassword(value);
              if (error) setError("");
            }}
            isInvalid={submitted && !password}
          />

          <hr className="w-full border-t border-gray-200 dark:border-gray-700 my-2" />

          <ButtonGroup className="w-full">
            <Button
              type="submit"
              color="primary"
              className="flex-1"
              isLoading={isLoading}
            >
              {t("auth.signIn")}
            </Button>

            <Tooltip
              content={t("auth.idCardTooltip")}
              placement="bottom"
              showArrow
            >
              <Button
                type="button"
                variant="solid"
                // isDisabled
                startContent={<NfcIcon />}
              >
                {t("auth.idCard")}
              </Button>
            </Tooltip>
          </ButtonGroup>

          {error && (
            <p className="w-full text-sm text-red-500 text-center mt-6">{error}</p>
          )}
        </Form>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-500 dark:text-gray-400">
        © 2025 Smart School. All rights reserved.
      </footer>
    </section>
  );
}
