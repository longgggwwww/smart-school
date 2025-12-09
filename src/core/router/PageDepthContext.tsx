/**
 * Page Depth Context for Route Animations
 */
import { createContext, useContext, useRef, useMemo, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { PAGE_DEPTH, getPageDepth } from "./types";

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

  const currentDepth = getPageDepth(location.pathname);
  const prevDepth = getPageDepth(prevPathRef.current ?? "/");

  if (
    prevPathRef.current !== null &&
    prevPathRef.current !== location.pathname
  ) {
    directionRef.current = currentDepth > prevDepth ? 1 : -1;
    prevDepthRef.current = prevDepth;
  }

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

export { PAGE_DEPTH };
