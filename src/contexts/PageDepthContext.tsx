import { createContext, useContext, useRef, useMemo, ReactNode } from "react";
import { useLocation } from "react-router-dom";

// Page depth for determining slide direction (higher = deeper page)
const PAGE_DEPTH: Record<string, number> = {
  "/": 0,
  "/dashboard": 0,
  "/forgot-password": 1,
  // Add more routes as needed
};

interface PageDepthContextType {
  currentDepth: number;
  prevDepth: number;
  direction: number;
  currentPath: string;
}

const PageDepthContext = createContext<PageDepthContextType | null>(null);

export function PageDepthProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);
  const directionRef = useRef<number>(1);
  const prevDepthRef = useRef<number>(0);

  // Calculate depths
  const currentDepth = PAGE_DEPTH[location.pathname] ?? 0;
  const prevDepth = PAGE_DEPTH[prevPathRef.current ?? "/"] ?? 0;

  // Only update direction when path actually changes
  if (
    prevPathRef.current !== null &&
    prevPathRef.current !== location.pathname
  ) {
    directionRef.current = currentDepth > prevDepth ? 1 : -1;
    prevDepthRef.current = prevDepth;
  }

  // Update prev path after calculating direction
  if (prevPathRef.current !== location.pathname) {
    prevPathRef.current = location.pathname;
  }

  const value = useMemo(
    () => ({
      currentDepth,
      prevDepth: prevDepthRef.current,
      direction: directionRef.current,
      currentPath: location.pathname,
    }),
    [currentDepth, location.pathname]
  );

  return (
    <PageDepthContext.Provider value={value}>
      {children}
    </PageDepthContext.Provider>
  );
}

export function usePageDepth() {
  const context = useContext(PageDepthContext);
  if (!context) {
    throw new Error("usePageDepth must be used within PageDepthProvider");
  }
  return context;
}

// Export PAGE_DEPTH for external use if needed
export { PAGE_DEPTH };
