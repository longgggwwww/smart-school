import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { usePageDepth } from "../../contexts/PageDepthContext";

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

interface AnimatedOutletProps {
  className?: string;
}

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
