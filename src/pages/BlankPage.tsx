import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";

export default function BlankPage() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="flex-1 p-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardBody className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-6xl">🚧</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("common.pageUnderConstruction")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("common.comingSoon")}
          </p>
          <code className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
            {location.pathname}
          </code>
        </CardBody>
      </Card>
    </div>
  );
}
