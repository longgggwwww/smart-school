import { useState, useEffect, useCallback } from "react";
import {
  AppConfig,
  WindowConfig,
  Theme,
  ScreenMode,
  getConfig,
  setConfig,
  getTheme,
  setTheme as setThemeService,
  getWindowState,
  saveWindowState as saveWindowStateService,
  getAutoStart,
  setAutoStart as setAutoStartService,
} from "../services/configService";

export type { AppConfig, WindowConfig, Theme, ScreenMode };

/**
 * Hook to manage the full app configuration
 */
export function useAppConfig() {
  const [config, setConfigState] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load config on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const cfg = await getConfig();
      setConfigState(cfg);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = useCallback(async (newConfig: AppConfig) => {
    try {
      await setConfig(newConfig);
      setConfigState(newConfig);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }, []);

  return {
    config,
    loading,
    error,
    reload: loadConfig,
    updateConfig,
  };
}

/**
 * Hook to manage theme setting
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      setLoading(true);
      const t = await getTheme();
      setThemeState(t);
    } catch (err) {
      console.error("Failed to load theme:", err);
    } finally {
      setLoading(false);
    }
  };

  const setTheme = useCallback(async (newTheme: Theme) => {
    try {
      await setThemeService(newTheme);
      setThemeState(newTheme);
    } catch (err) {
      console.error("Failed to set theme:", err);
      throw err;
    }
  }, []);

  return {
    theme,
    loading,
    setTheme,
    reload: loadTheme,
  };
}

/**
 * Hook to manage window state
 */
export function useWindowState() {
  const [windowState, setWindowState] = useState<WindowConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWindowState();
  }, []);

  const loadWindowState = async () => {
    try {
      setLoading(true);
      const state = await getWindowState();
      setWindowState(state);
    } catch (err) {
      console.error("Failed to load window state:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveWindowState = useCallback(async (state: WindowConfig) => {
    try {
      await saveWindowStateService(state);
      setWindowState(state);
    } catch (err) {
      console.error("Failed to save window state:", err);
      throw err;
    }
  }, []);

  return {
    windowState,
    loading,
    saveWindowState,
    reload: loadWindowState,
  };
}

/**
 * Hook to manage auto-start setting
 */
export function useAutoStart() {
  const [autoStart, setAutoStartState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAutoStart();
  }, []);

  const loadAutoStart = async () => {
    try {
      setLoading(true);
      const enabled = await getAutoStart();
      setAutoStartState(enabled);
    } catch (err) {
      console.error("Failed to load auto-start setting:", err);
    } finally {
      setLoading(false);
    }
  };

  const setAutoStart = useCallback(async (enabled: boolean) => {
    try {
      await setAutoStartService(enabled);
      setAutoStartState(enabled);
    } catch (err) {
      console.error("Failed to set auto-start:", err);
      throw err;
    }
  }, []);

  return {
    autoStart,
    loading,
    setAutoStart,
    reload: loadAutoStart,
  };
}
