/**
 * Window State Sync Hook
 * Auto-syncs window state changes to config file
 */
import { useEffect, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { saveWindowState } from "@src/core/config/service";
import type { ScreenMode } from "@src/core/config/types";

/**
 * Hook to automatically sync window state changes to config file
 * Tracks window resize, maximize/unmaximize, and fullscreen events
 * and saves them to the config with debouncing to avoid excessive writes
 */
export function useWindowStateSync(debounceMs: number = 500) {
  const timeoutRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    let unlistenResize: (() => void) | undefined;
    let unlistenMove: (() => void) | undefined;
    const currentWindow = getCurrentWindow();

    const saveCurrentState = async () => {
      try {
        const [position, size, isMaximized, isFullscreen] = await Promise.all([
          currentWindow.outerPosition(),
          currentWindow.outerSize(),
          currentWindow.isMaximized(),
          currentWindow.isFullscreen(),
        ]);

        let screenMode: ScreenMode = "normal";
        if (isFullscreen) {
          screenMode = "fullscreen";
        } else if (isMaximized) {
          screenMode = "maximized";
        }

        await saveWindowState({
          width: size.width,
          height: size.height,
          x: position.x,
          y: position.y,
          screen_mode: screenMode,
        });

        console.log("Window state saved:", {
          width: size.width,
          height: size.height,
          x: position.x,
          y: position.y,
          screen_mode: screenMode,
        });
      } catch (error) {
        console.error("Failed to save window state:", error);
      }
    };

    const debouncedSave = () => {
      // Skip saving during initialization to avoid overwriting with incorrect values
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        return;
      }

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        saveCurrentState();
      }, debounceMs);
    };

    const setupListeners = async () => {
      // Wait a bit before marking as initialized to avoid initial events
      setTimeout(() => {
        isInitializedRef.current = true;
      }, 1000);

      // Listen for resize events (includes maximize/unmaximize)
      unlistenResize = await currentWindow.onResized(() => {
        debouncedSave();
      });

      // Listen for move events
      unlistenMove = await currentWindow.onMoved(() => {
        debouncedSave();
      });
    };

    setupListeners();

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      if (unlistenResize) unlistenResize();
      if (unlistenMove) unlistenMove();
    };
  }, [debounceMs]);
}
