import { Image } from "@heroui/react";
import { TitleBar } from "../layout";
import AnimatedOutlet from "../common/AnimatedOutlet";

/**
 * AuthLayout - Shared layout for authentication pages (login, forgot-password, etc.)
 * 
 * Features:
 * - Static TitleBar with back button for nested auth pages
 * - Static Logo
 * - Animated content area (AnimatedOutlet)
 * - Static Footer
 */
export default function AuthLayout() {
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Static TitleBar - not affected by animation */}
      <TitleBar rootRoutes={["/"]} />

      {/* Static Logo - not affected by animation */}
      <div className="flex flex-col items-center pt-8 pb-4">
        <Image src="/tauri.svg" alt="Logo" className="w-16 h-16" />
      </div>

      {/* Animated content area - only this part animates */}
      <AnimatedOutlet className="bg-white dark:bg-gray-900" />

      {/* Static Footer - not affected by animation */}
      <footer className="text-center py-4 text-xs text-gray-500 dark:text-gray-400">
        © 2025 Smart School. All rights reserved.
      </footer>
    </div>
  );
}
