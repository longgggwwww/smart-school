/**
 * Layout Components Exports
 */
export { default as MenuBar, type MenuBarProps } from "./MenuBar";
export {
  MenuBarProvider,
  useMenuBar,
  useMenuBarConfig,
} from "./MenuBarContext";

// Backwards-compatibility exports (deprecated)
export { default as TitleBar } from "./MenuBar";
export type { MenuBarProps as TitleBarProps } from "./MenuBar";
export { MenuBarProvider as TitleBarProvider } from "./MenuBarContext";
export { useMenuBar as useTitleBar } from "./MenuBarContext";
export { useMenuBarConfig as useTitleBarConfig } from "./MenuBarContext";

// Main layout sub-components
export { UserMenu } from "./UserMenu";
export { UserInfo } from "./UserInfo";
export { FullscreenControl } from "./FullscreenControl";
export { FluidContent } from "./FluidContent";
export { StatusBar } from "./StatusBar";
