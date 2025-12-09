/**
 * FluidContent Component
 * Responsive content wrapper with title header
 * Used for pages that display dynamic content based on navigation
 */
import { ReactNode } from "react";

interface FluidContentProps {
  /** Page title - displayed as header */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Content to render */
  children: ReactNode;
  /** Additional CSS classes for container */
  className?: string;
}

export function FluidContent({
  title,
  subtitle,
  children,
  className = "",
}: FluidContentProps) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <header className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </main>
    </div>
  );
}

export default FluidContent;
