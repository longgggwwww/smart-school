import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@heroui/react";

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
    <section className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Content */}
      <main className="flex-1 flex flex-col items-center pt-4 px-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center">
          {t("auth.forgotPasswordTitle")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
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
    </section>
  );
}
