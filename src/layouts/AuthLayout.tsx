/**
 * Auth Layout
 * Layout wrapper for authentication pages
 */
import { Image } from "@src/shared/components/ui";
import {
  MenuBar,
  AnimatedOutlet,
  LanguageSwitcher,
  ThemeSwitcher,
} from "@src/shared/components";

export default function AuthLayout() {
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <MenuBar
        rootRoutes={["/"]}
        leftContent={[<ThemeSwitcher />, <LanguageSwitcher />]}
      />
      <div className="flex flex-col items-center pt-8 pb-4">
        <Image src="/tauri.svg" alt="Logo" className="w-16 h-16" />
      </div>
      <AnimatedOutlet className="bg-white dark:bg-gray-900" />
      <footer className="text-center py-4 text-xs text-gray-500 dark:text-gray-400">
        © 2025 Smart School. All rights reserved.
      </footer>
    </div>
  );
}
