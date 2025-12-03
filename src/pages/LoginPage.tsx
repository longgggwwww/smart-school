import { useState } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button, Input, Card, CardBody, CardHeader } from "@heroui/react";
import { LanguageSwitcher } from "../components";

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate login validation (replace with actual auth logic)
      if (!email || !password) {
        setError(t("auth.errorRequired"));
        setIsLoading(false);
        return;
      }

      // TODO: Add actual authentication logic here
      // For now, any email/password combination works

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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Custom Title Bar (since decorations are disabled) */}
      <div
        className="flex items-center justify-between h-10 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-move select-none"
        onMouseDown={handleDrag}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Smart School
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleMinimize}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 10h10a1 1 0 110 2H5a1 1 0 110-2z" />
            </svg>
          </button>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Login Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="flex flex-col gap-2 items-center pb-0 pt-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-2">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {t("auth.welcome")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("auth.signInToContinue")}
            </p>
          </CardHeader>

          <CardBody className="px-6 py-6">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input
                type="email"
                label={t("auth.email")}
                placeholder={t("auth.emailPlaceholder")}
                value={email}
                onValueChange={setEmail}
                variant="bordered"
                isRequired
              />

              <Input
                type="password"
                label={t("auth.password")}
                placeholder={t("auth.passwordPlaceholder")}
                value={password}
                onValueChange={setPassword}
                variant="bordered"
                isRequired
              />

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                type="submit"
                color="primary"
                className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-600"
                isLoading={isLoading}
              >
                {t("auth.signIn")}
              </Button>

              <div className="flex items-center justify-between mt-2">
                <a
                  href="#"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {t("auth.forgotPassword")}
                </a>
                <LanguageSwitcher />
              </div>
            </form>
          </CardBody>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-gray-500 dark:text-gray-400">
        © 2025 Smart School. All rights reserved.
      </div>
    </div>
  );
}
