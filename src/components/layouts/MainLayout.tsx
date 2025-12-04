import AnimatedOutlet from "../common/AnimatedOutlet";

/**
 * MainLayout - Layout for main application pages (dashboard, settings, etc.)
 * 
 * Features:
 * - Animated content area for sub-routes
 * - Each page controls its own TitleBar configuration
 * 
 * Note: TitleBar is rendered by individual pages (like DashboardPage)
 * because each main page may have different TitleBar configurations
 * (e.g., different center content, right content, maximize button, etc.)
 */
export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Animated content - pages render their own TitleBar */}
      <AnimatedOutlet />
    </div>
  );
}
