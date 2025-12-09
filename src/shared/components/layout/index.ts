/**
 * Layout Components Exports
 */
export { default as TitleBar, type TitleBarProps } from "./TitleBar";
export {
  TitleBarProvider,
  useTitleBar,
  useTitleBarConfig,
} from "./TitleBarContext";

// Main layout sub-components
export { UserMenu } from "./UserMenu";
export { UserInfo } from "./UserInfo";
export { FullscreenControl } from "./FullscreenControl";
export { FluidContent } from "./FluidContent";
export { StatusBar } from "./StatusBar";
