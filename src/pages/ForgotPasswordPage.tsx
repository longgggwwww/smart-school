import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input, Image } from "@heroui/react";
import { TitleBar } from "../components";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleRequestTeacher = () => {
    setSubmitted(true);
    if (!username) {
      setError(t("auth.errorUsernameRequired"));
      return;
    }
    // TODO: Implement request teacher for password reset
    console.log("Request teacher for:", username);
    // Show success message or navigate back
  };

  return (
    <section className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Reusable Title Bar - back button auto shows on this deep route */}
      <TitleBar rootRoutes={["/"]} />

      {/* Content */}
      <main className="flex-1 flex flex-col items-center pt-12 px-4">
        {/* Logo */}
        <Image src="/tauri.svg" alt="Logo" className="w-16 h-16 mb-3" />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          {t("auth.forgotPasswordTitle")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {t("auth.forgotPasswordDesc")}
        </p>

        <div className="flex flex-col gap-3 w-full max-w-sm">
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
          />

          <hr className="w-full border-t border-gray-200 dark:border-gray-700 my-2" />

          <Button
            color="primary"
            className="w-full"
            onPress={handleRequestTeacher}
          >
            {t("auth.requestTeacher")}
          </Button>

          {error && (
            <p className="w-full text-sm text-red-500 text-center mt-4">
              {error}
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-500 dark:text-gray-400">
        © 2025 Smart School. All rights reserved.
      </footer>
    </section>
  );
}
