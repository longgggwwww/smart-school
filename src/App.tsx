import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import LanguageSwitcher from "./components/common/LanguageSwitcher";

function App() {
  const { t } = useTranslation();
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    const result = await invoke<string>("greet", { name });
    setGreetMsg(result);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Language Switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        {/* Greet Form Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-0 pt-4 px-6">
            <h2 className="text-xl font-semibold">{t("common.greet")}</h2>
          </CardHeader>
          <CardBody className="px-6 py-6">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                greet();
              }}
            >
              <Input
                label={t("common.enterName")}
                placeholder={t("common.enterName")}
                value={name}
                onValueChange={setName}
                variant="bordered"
                size="lg"
                classNames={{
                  inputWrapper: "border-2",
                }}
              />
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="font-semibold"
              >
                {t("common.greet")}
              </Button>
            </form>

            {greetMsg && (
              <Card className="mt-4 bg-success-50 dark:bg-success-900/20">
                <CardBody className="py-3">
                  <p className="text-success-700 dark:text-success-400 text-center font-medium">
                    {greetMsg}
                  </p>
                </CardBody>
              </Card>
            )}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}

export default App;
