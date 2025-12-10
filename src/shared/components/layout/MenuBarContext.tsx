/**
 * MenuBar Context (renamed from TitleBarContext)
 * Allows pages to configure the MenuBar dynamically
 */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { MenuBarProps } from "./MenuBar";

interface MenuBarContextType {
  config: Partial<MenuBarProps>;
  setConfig: (config: Partial<MenuBarProps>) => void;
  resetConfig: () => void;
}

const defaultConfig: Partial<MenuBarProps> = {
  showBack: "auto",
  leftContent: [],
  centerContent: [],
  rightContent: [],
};

const MenuBarContext = createContext<MenuBarContextType | null>(null);

export function MenuBarProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] =
    useState<Partial<MenuBarProps>>(defaultConfig);

  const setConfig = useCallback((newConfig: Partial<MenuBarProps>) => {
    setConfigState((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(defaultConfig);
  }, []);

  return (
    <MenuBarContext.Provider value={{ config, setConfig, resetConfig }}>
      {children}
    </MenuBarContext.Provider>
  );
}

export function useMenuBar() {
  const context = useContext(MenuBarContext);
  if (!context) {
    throw new Error("useMenuBar must be used within MenuBarProvider");
  }
  return context;
}

// Hook to configure MenuBar from a page component
export function useMenuBarConfig(config: Partial<MenuBarProps>) {
  const { setConfig, resetConfig } = useMenuBar();

  // Set config on mount, reset on unmount
  useState(() => {
    setConfig(config);
    return () => resetConfig();
  });
}

// Backwards-compat aliases for a short deprecation period
// export { MenuBarProvider as TitleBarProvider };
// export const useTitleBar = useMenuBar;
// export const useTitleBarConfig = useMenuBarConfig;
