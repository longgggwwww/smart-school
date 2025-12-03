import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";

interface GreetFormProps {
  className?: string;
}

/**
 * Greet form component - handles name input and greeting display
 */
export default function GreetForm({ className }: GreetFormProps) {
  const { t } = useTranslation();
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGreet = useCallback(async () => {
    if (!name.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await invoke<string>("greet", { name });
      setGreetMsg(result);
    } catch (error) {
      console.error("Failed to greet:", error);
    } finally {
      setIsLoading(false);
    }
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGreet();
  };

  return (
    <Card className={`shadow-lg ${className ?? ""}`}>
      <CardHeader className="pb-0 pt-4 px-6">
        <h2 className="text-xl font-semibold">{t("common.greet")}</h2>
      </CardHeader>
      <CardBody className="px-6 py-6">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            isLoading={isLoading}
            isDisabled={!name.trim()}
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
  );
}
