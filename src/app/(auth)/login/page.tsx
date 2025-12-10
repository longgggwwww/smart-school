import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Form,
  ButtonGroup,
  Link,
  Checkbox,
} from "@src/shared/components/ui";
import { SavedAccount, AuthErrorCode } from "@src/features/auth/types";
import {
  login,
  getSavedAccounts,
  removeSavedAccount,
  openMainWindow,
  AuthError,
} from "@src/features/auth/service";
import { getRememberMeDefault, getNfcEnabled } from "@src/core/config/service";
import {
  ChevronDownIcon,
  NfcIcon,
  CloseIcon,
} from "@src/shared/components/icons";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [rememberMe, setRememberMe] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(false);

  // Load saved accounts and config on mount
  useEffect(() => {
    getSavedAccounts().then(setSavedAccounts);
    getRememberMeDefault().then(setRememberMe);
    getNfcEnabled().then(setNfcEnabled);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    // Validate before loading
    if (!username || !password) {
      setError(t("auth.errorRequired"));
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting login with:", { username, password: "***" });

      const response = await login({
        username,
        password,
        remember_me: rememberMe,
      });

      console.log("Login successful:", response);

      // Open main window and close login window
      console.log("Opening main window...");
      await openMainWindow();
      console.log("Main window opened");
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error name:", (err as Error)?.name);
      console.error("Error constructor:", (err as Error)?.constructor?.name);

      // Check by error name since instanceof may not work across module boundaries
      const error = err as AuthError;
      if (error?.name === "AuthError" && error?.code) {
        switch (error.code) {
          case AuthErrorCode.USER_NOT_FOUND:
            setError(t("auth.errorUserNotFound"));
            break;
          case AuthErrorCode.INVALID_CREDENTIALS:
            setError(t("auth.errorInvalidCredentials"));
            break;
          case AuthErrorCode.ACCOUNT_LOCKED:
            setError(t("auth.errorAccountLocked"));
            break;
          case AuthErrorCode.ACCOUNT_INACTIVE:
            setError(t("auth.errorAccountInactive"));
            break;
          default:
            setError(t("auth.errorLogin"));
        }
      } else {
        setError(t("auth.errorLogin"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAccount = (account: SavedAccount) => {
    setUsername(account.username);
    setError("");
    setSubmitted(false);
  };

  const handleRemoveAccount = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    await removeSavedAccount(userId);
    const updatedAccounts = savedAccounts.filter((a) => a.user_id !== userId);
    setSavedAccounts(updatedAccounts);
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <section className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Login Content */}
      <main className="flex-1 flex flex-col items-center pt-4 px-4">
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
                    onAction={(key) => {
                      const account = savedAccounts.find(
                        (a) => a.user_id === key
                      );
                      if (account) handleSelectAccount(account);
                    }}
                  >
                    {savedAccounts.map((account) => (
                      <DropdownItem
                        key={account.user_id}
                        endContent={
                          <Tooltip content={t("auth.removeAccount")}>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              className="min-w-6 w-6 h-6 text-danger"
                              onPress={(e) =>
                                handleRemoveAccount(
                                  e as unknown as React.MouseEvent,
                                  account.user_id
                                )
                              }
                            >
                              <CloseIcon />
                            </Button>
                          </Tooltip>
                        }
                      >
                        {account.full_name} ({account.username})
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

          <div className="w-full flex justify-between items-center">
            <Checkbox
              size="sm"
              isSelected={rememberMe}
              onValueChange={setRememberMe}
            >
              {t("auth.rememberMe")}
            </Checkbox>
            <Link
              size="sm"
              className="cursor-pointer"
              onPress={handleForgotPassword}
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>

          <hr className="w-full border-t border-gray-200 dark:border-gray-700 mb-2" />

          <ButtonGroup className="w-full">
            <Button
              type="submit"
              color="primary"
              className="flex-1"
              isLoading={isLoading}
            >
              {t("auth.signIn")}
            </Button>

            {nfcEnabled && (
              <Tooltip
                content={t("auth.idCardTooltip")}
                placement="bottom"
                showArrow
              >
                <Button
                  type="button"
                  variant="solid"
                  startContent={<NfcIcon />}
                >
                  {t("auth.idCard")}
                </Button>
              </Tooltip>
            )}
          </ButtonGroup>

          {error && (
            <p className="w-full text-sm text-red-500 text-center mt-6">
              {error}
            </p>
          )}
        </Form>
      </main>
    </section>
  );
}
