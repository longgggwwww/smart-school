import { useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Image } from "@heroui/react";
import { LoginPage, DashboardPage, ForgotPasswordPage } from "../../pages";
import { TitleBar } from "../layout";

// Page depth for determining slide direction (higher = deeper page)
const PAGE_DEPTH: Record<string, number> = {
  "/": 0,
  "/dashboard": 0,
  "/forgot-password": 1,
};

// Auth pages that share the same TitleBar
const AUTH_PAGES = ["/", "/forgot-password"];

// iPhone-style slide animation - pure linear slide, no fade
const slideVariants = {
  // Enter: new page slides in
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
  }),
  // Center position
  center: {
    x: 0,
  },
  // Exit: old page slides out
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
  }),
};

export default function AnimatedRoutes() {
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);
  const directionRef = useRef<number>(1);

  // Calculate direction synchronously before render
  const currentDepth = PAGE_DEPTH[location.pathname] ?? 0;
  const prevDepth = PAGE_DEPTH[prevPathRef.current ?? "/"] ?? 0;

  // Only update direction when path actually changes
  if (prevPathRef.current !== null && prevPathRef.current !== location.pathname) {
    directionRef.current = currentDepth > prevDepth ? 1 : -1;
  }

  // Update prev path after calculating direction
  if (prevPathRef.current !== location.pathname) {
    prevPathRef.current = location.pathname;
  }

  const direction = directionRef.current;
  const isAuthPage = AUTH_PAGES.includes(location.pathname);

  // Auth pages layout with shared static TitleBar and Footer
  if (isAuthPage) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
        {/* Static TitleBar - not affected by animation */}
        <TitleBar rootRoutes={["/"]} />

        {/* Static Logo - not affected by animation */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <Image src="/tauri.svg" alt="Logo" className="w-16 h-16" />
        </div>

        {/* Animated content area */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={location.pathname}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", duration: 0.35, ease: "easeInOut" },
              }}
              className="absolute inset-0 bg-white dark:bg-gray-900"
            >
              <Routes location={location}>
                <Route path="/" element={<LoginPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Static Footer - not affected by animation */}
        <footer className="text-center py-4 text-xs text-gray-500 dark:text-gray-400">
          © 2025 Smart School. All rights reserved.
        </footer>
      </div>
    );
  }

  // Non-auth pages (Dashboard, etc.) - render directly without shared TitleBar
  return (
    <Routes location={location}>
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
