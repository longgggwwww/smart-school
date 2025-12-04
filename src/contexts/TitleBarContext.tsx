import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { TitleBarProps } from "../components/layout/TitleBar";

interface TitleBarContextType {
  config: Partial<TitleBarProps>;
  setConfig: (config: Partial<TitleBarProps>) => void;
  resetConfig: () => void;
}

const defaultConfig: Partial<TitleBarProps> = {
  showBack: "auto",
  showThemeSwitcher: true,
  showLanguageSwitcher: true,
  showMinimize: true,
  showMaximize: false,
  showClose: true,
};

const TitleBarContext = createContext<TitleBarContextType | null>(null);

export function TitleBarProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<Partial<TitleBarProps>>(defaultConfig);

  const setConfig = useCallback((newConfig: Partial<TitleBarProps>) => {
    setConfigState((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(defaultConfig);
  }, []);

  return (
    <TitleBarContext.Provider value={{ config, setConfig, resetConfig }}>
      {children}
    </TitleBarContext.Provider>
  );
}

export function useTitleBar() {
  const context = useContext(TitleBarContext);
  if (!context) {
    throw new Error("useTitleBar must be used within TitleBarProvider");
  }
  return context;
}

// Hook to configure TitleBar from a page component
export function useTitleBarConfig(config: Partial<TitleBarProps>) {
  const { setConfig, resetConfig } = useTitleBar();

  // Set config on mount, reset on unmount
  useState(() => {
    setConfig(config);
    return () => resetConfig();
  });
}
