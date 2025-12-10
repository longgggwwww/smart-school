/**
 * Blank Page - Dynamic content page for unimplemented routes
 * Uses FluidContent wrapper with title from navigation
 */
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { FluidContent } from "@src/shared/components/layout/FluidContent";

// Lorem ipsum content for placeholder
const LOREM_CONTENT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`;

interface BlankPageProps {
  /** Optional title override - if not provided, will use navigation label */
  title?: string;
}

export default function BlankPage({ title }: BlankPageProps) {
  const { t } = useTranslation();
  const location = useLocation();

  // Extract page title from path or use provided title
  const getPageTitle = (): string => {
    if (title) return title;

    // Try to get title from navigation key based on path
    const pathParts = location.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || "page";

    // Convert path segment to nav key format (e.g., "system-status" -> "nav.admin.systemStatus")
    const navKey = `nav.admin.${lastPart.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`;

    // Try to translate, fallback to capitalized path segment
    const translated = t(navKey);
    if (translated !== navKey) {
      return translated;
    }

    // Fallback: capitalize the path segment
    return lastPart
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <FluidContent
      title={getPageTitle()}
      subtitle={t("common.pageUnderConstruction")}
    >
      <div className="prose dark:prose-invert max-w-none">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🚧</span>
            <span className="font-medium text-yellow-800 dark:text-yellow-200">
              {t("common.pageUnderConstructionDesc")}
            </span>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 font-mono">
            {location.pathname}
          </p>
        </div>

        <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
          {LOREM_CONTENT}
        </div>
      </div>
    </FluidContent>
  );
}
