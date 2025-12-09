/**
 * Blank Page - Placeholder for unimplemented routes
 */
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function BlankPage() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-6xl mb-4">🚧</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {t("common.pageUnderConstruction")}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        {t("common.pageUnderConstructionDesc")}
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-4 font-mono">
        {location.pathname}
      </p>
    </div>
  );
}
