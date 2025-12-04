import { ReactNode } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { usePageDepth } from "../../contexts/PageDepthContext";

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

interface AnimatedOutletProps {
  /** Custom class for the animated container */
  className?: string;
}

/**
 * AnimatedOutlet wraps the router Outlet with slide animations.
 * Used within layouts to animate page transitions while keeping
 * layout elements (TitleBar, Footer, etc.) static.
 */
export default function AnimatedOutlet({
  className = "",
}: AnimatedOutletProps) {
  const location = useLocation();
  const { direction } = usePageDepth();
  const outlet = useOutlet();

  return (
    <div className={`flex-1 relative overflow-hidden ${className}`}>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
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
          className="absolute inset-0"
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface AnimatedContentProps {
  /** Content to animate */
  children: ReactNode;
  /** Unique key for animation (usually location.pathname) */
  locationKey: string;
  /** Custom class for the animated container */
  className?: string;
}

/**
 * AnimatedContent is a more flexible version that accepts children directly.
 * Use this when you need to animate content outside of router context.
 */
export function AnimatedContent({
  children,
  locationKey,
  className = "",
}: AnimatedContentProps) {
  const { direction } = usePageDepth();

  return (
    <div className={`flex-1 relative overflow-hidden ${className}`}>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={locationKey}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: 0.35, ease: "easeInOut" },
          }}
          className="absolute inset-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
